import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import cottageIcon from "../../assets/images/cottage.svg";
import searchIcon from "../../assets/images/search-gr.svg";
import palletIcon from "../../assets/images/pallet-gr.svg";
import zoomInIcon from "../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../assets/images/zoom-out.svg";
import fontIcon from "../../assets/images/profile-config/font.svg";
import arrrowDownIcon from "../../assets/images/profile-config/chevron-down.svg";
import textColorIcon from "../../assets/images/profile-config/font-color.svg";
import textBackgroundColorIcon from "../../assets/images/profile-config/highlight-alt.svg";
import fontSizeIcon from "../../assets/images/profile-config/font-size.svg";
import boldIcon from "../../assets/images/profile-config/bold.svg";
import italicIcon from "../../assets/images/profile-config/italic.svg";
import underlineIcon from "../../assets/images/profile-config/underline.svg";
import strikethroughIcon from "../../assets/images/profile-config/strikethrough.svg";
import alignIcon from "../../assets/images/profile-config/text-align-justify.svg";
import leftIndentIcon from "../../assets/images/profile-config/indent-increase.svg";
import orderedListIcon from "../../assets/images/profile-config/ordered-list.svg";
import unorderedListIcon from "../../assets/images/profile-config/unordered-list.svg";
import { HighlightColorProfileProps } from "./ContextMenu";
import { CommentedHighlight } from "./types";
import { v4 as uuidv4 } from 'uuid';

interface ControlBarProps {
  selectedProfileID: boolean;  // Now using boolean to track the profile selection state
  setSelectedProfileID: (value: boolean) => void;
  setPdfScaleValue: (value: number) => void;
  highlightColorProfile: HighlightColorProfileProps[];
  highlights: Array<CommentedHighlight>;
  setHighlights: (highlights: Array<CommentedHighlight>) => void;
  resetHighlights: () => void;
}


const ControlBar = ({
  highlights,
  setHighlights,
  selectedProfileID,
  setSelectedProfileID,
  setPdfScaleValue,
  highlightColorProfile,
  resetHighlights,
}: ControlBarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [profileConfigPopup, setProfileConfigPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  // const [fields, setFields] = useState<Field[]>([]);
  const [localProfile, setLocalProfile] = useState<HighlightColorProfileProps[]>([]);

  const zoomIn = () => {
    if (zoom) {
      if (zoom < 4) {
        setPdfScaleValue(zoom + 0.1);
        setZoom(zoom + 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomOut = () => {
    if (zoom) {
      if (zoom > 0.2) {
        setPdfScaleValue(zoom - 0.1);
        setZoom(zoom - 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  useEffect(() => {
    setLocalProfile([...highlightColorProfile]);
  }, [highlightColorProfile]);

  const handleAddProfileField = () => {
    const newField: HighlightColorProfileProps = {
      userID: { S: "user123" },
      highlightColorProfile: { S: "default" },
      configColor: { S: "#000000" },
      configID: { S: `config-${uuidv4()}` },
      color: { S: "#000000" },
      background: { S: "" },
      font: { S: "serif" },
      bold: { BOOL: false },
      italic: { BOOL: false },
      underline: { BOOL: false },
      strike: { BOOL: false },
      header: { N: 3 },
      list: { S: "" },
      script: { S: "" },
      indent: { N: 0 },
      align: { S: "left" },
      size: { S: "small" },
    };

    setLocalProfile((prevProfile) => [...prevProfile, newField]);
  };

  const handleRemoveProfile = (index: number) => {
    setLocalProfile((prevProfile) =>
      prevProfile.filter((_, i) => i !== index)
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setProfileConfigPopup(false);
    }
  };

  const handleProfileChange = (
    index: number,
    key: keyof HighlightColorProfileProps,
    value: string | boolean | number
  ) => {
    setLocalProfile((prevProfile) =>
      prevProfile.map((item, i) => {
        if (i === index) {
          if (['indent', 'header'].includes(key)) {
            return { ...item, [key]: { N: value as number } };
          } else if (['bold', 'italic', 'underline', 'strike'].includes(key)) {
            return { ...item, [key]: { BOOL: value as boolean } };
          } else {
            return { ...item, [key]: { S: value as string } };
          }
        }
        return item;
      })
    );
  };

  const profileColorMap = (localProfile: HighlightColorProfileProps[]) => {
    const colorMap: { [key: string]: string } = {};

    localProfile.forEach(item => {
      if (item.configID?.S && item.configColor?.S) {
        colorMap[item.configID.S] = item.configColor.S;
      }
    });
    return colorMap;
  };


  const handleSubmit = async () => {
    try {
      const currentColorMap = profileColorMap(highlightColorProfile);
      const response = await axios.post("http://localhost:5000/profile/save", { items: localProfile });
      setSelectedProfileID(!selectedProfileID);
      if (response.data.success) {

        // Check for changes in the color map
        const updatedColorMap = profileColorMap(localProfile);
        console.log('current colormap: ', currentColorMap);
        console.log('updated colormap: ', updatedColorMap);

        const changedColors: Record<string, string> = Object.keys(currentColorMap).reduce((acc, key) => {
          console.log('current colormap key: ', currentColorMap[key]);
          console.log('updated colormap key: ', updatedColorMap[key]);
          if (currentColorMap[key] !== updatedColorMap[key]) {
            // If color has changed, store the key and updated color
            acc[key] = updatedColorMap[key];
          }
          console.log('acc', acc);
          return acc;
        }, {} as Record<string, string>);

        console.log('changed colors: ', changedColors);
        setProfileConfigPopup(false);

        if (Object.keys(changedColors).length > 0) {
          // Update the highlights with the new colors for each changed key
          const updatedHighlights = highlights
            .filter(highlight => updatedColorMap[highlight.configID]) // Filter out highlights with no matching configID
            .map(highlight => {
              const newColor = changedColors[highlight.configID];
              return newColor ? { ...highlight, color: newColor } : highlight;
            });

          console.log('updated highglihts', updatedHighlights);

          setHighlights(updatedHighlights);
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen ">
      <div className="flex flex-col gap-5 p-[10px] ">

        <a href="/files" className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer">
          <img src={cottageIcon} alt="home-icon" className="w-7" />
        </a>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] focus:bg-[#FFE7D4] cursor-pointer">
          <img src={searchIcon} alt="search icon" className="w-7" />
        </div>
        <div className={`p-1.5 flex items-center justify-center rounded-xl cursor-pointer hover:bg-[#FFE7D4] ${profileConfigPopup === true ? 'bg-[#FFE7D4]' : ''}`}
          onClick={() => setProfileConfigPopup(!profileConfigPopup)}
        >
          <img src={palletIcon} alt="color-pallete icon" className="w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer" onClick={zoomIn}>
          <img src={zoomInIcon} alt="zoom-in-icon" className="w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer" onClick={zoomOut}>
          <img src={zoomOutIcon} alt="zoom-out-icon" className="w-7" />
        </div>
      </div>
      <div className="flex flex-col px-2 text-center pt-5">
        <div className="bg-white rounded-md">1</div>
        <p className="text-sm">of 57</p>
      </div>
      <div
        className="cursor-pointer mt-auto text-center"
        onClick={resetHighlights}>
        reset
      </div>
      {profileConfigPopup && (
        <div
          ref={popupRef}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
          w-[70%] h-3/4 font-sserif bg-[#F4F4F4] border border-gray-300 shadow-lg rounded-md px-10 py-8 z-10 overflow-y-auto"
        >
          <form onSubmit={handleSubmit} className="grid grid-rows-[88%_12%] grid-cols-3 w-full h-full"> 
            {/* Render all dynamically added fields */}
            <div className="col-span-3 row-start-1 flex flex-wrap justify-center gap-5">
              {localProfile.map((profile, index) => (
                <div key={profile.configID.S} className="w-full max-w-[420px] max-h-[180px] border border-gray-300 rounded-md p-4 shadow-sm flex bg-[#EEEEEE]">
                  {/* Highlight Color */}
                  <div className="flex flex-col gap-2.5 items-center">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
                      style={{ backgroundColor: profile.configColor.S }}
                    >
                      <input
                        type="color"
                        name="highlightColor"
                        className="opacity-0 w-full h-full cursor-pointer"
                        value={profile.configColor.S}
                        onChange={(e) => handleProfileChange(index, 'configColor', e.target.value)}
                      />
                    </div>
                    <label className="rounded-sm bg-[#E1E1E1] text-center px-2 mb-11">
                      {profile.configColor.S.toUpperCase()}
                    </label>
                    <button
                      onClick={() => handleRemoveProfile(index)}
                      className="remove-button bg-[#E1E1E1] text-[#333333] px-3 rounded hover:text-[#FE3E3E]"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Font */}
                  <div className="p-3 w-full">
                    <div className="flex gap-2 mb-4">
                      <img src={fontIcon} alt="" className="w-3" />
                      <div className="bg-[#E1E1E1] w-full flex flex-1 items-center rounded-sm gap-2 px-2 cursor-pointer">
                        <select
                          className="bg-transparent w-full outline-none cursor-pointer text-sm appearance-none"
                          value={profile.font.S}
                          onChange={(e) => handleProfileChange(index, 'font', e.target.value)}
                        >
                          <option value="sans-serif">Sans Serif</option>
                          <option value="serif">Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      {/* Text Color */}
                      <div className="flex gap-1.5">
                        <img src={textColorIcon} alt="" className="w-3.5" />
                        <div className="rounded-sm bg-[#E1E1E1] flex items-center justify-center px-2 gap-1">
                          <div
                            className="w-2 h-2 overflow-hidden flex justify-center items-center cursor-pointer rounded-sm"
                            style={{ backgroundColor: profile.color.S }}
                          >
                            <input
                              type="color"
                              name="highlightColor"
                              className="opacity-0 w-full cursor-pointer"
                              value={profile.color.S}
                              onChange={(e) => handleProfileChange(index, 'color', e.target.value)}
                            />
                          </div>
                          <label className="text-center text-sm">
                            {profile.color.S.toUpperCase()}
                          </label>
                        </div>
                      </div>

                      {/* Text Background Color */}
                      <div className="flex gap-1.5 ">
                        <img src={textBackgroundColorIcon} alt="" className="w-3.5" />
                        <div className="rounded-sm bg-[#E1E1E1] flex items-center justify-center px-2 gap-1">
                          <div
                            className="w-2 h-2 overflow-hidden flex justify-center items-center cursor-pointer"
                            style={{ backgroundColor: profile.background.S }}
                          >
                            <input
                              type="color"
                              name="highlightColor"
                              className="opacity-0 cursor-pointer"
                              value={profile.background.S}
                              onChange={(e) => handleProfileChange(index, 'background', e.target.value)}
                            />
                          </div>
                          <label className="text-center text-sm">
                            {profile.background.S === '' ? 'Transparent' : profile.background.S.toUpperCase()}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      {/* Font Size */}
                      <div className="flex gap-1.5">
                        <img src={fontSizeIcon} alt="" className="w-3.5" />
                        <div className="bg-[#E1E1E1] flex items-center rounded-sm gap-2 px-2 cursor-pointer">
                          <select
                            className="bg-transparent outline-none cursor-pointer text-sm appearance-none"
                            value={profile.header.N}
                            onChange={(e) => handleProfileChange(index, 'header', e.target.value)}
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                          </select>
                        </div>
                      </div>

                      {/* Text Alignment*/}
                      <div className="flex gap-1.5">
                        <img src={alignIcon} alt="" className="w-3.5" />
                        <div className="bg-[#E1E1E1] flex items-center rounded-sm gap-2 px-2 cursor-pointer">
                          <select
                            className="bg-transparent outline-none cursor-pointer text-sm appearance-none"
                            value={profile.align.S}
                            onChange={(e) => handleProfileChange(index, 'align', e.target.value)}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                            <option value="justify">Justify</option>
                          </select>
                        </div>
                      </div>

                      {/* Indentation */}
                      <div className="flex gap-1.5">
                        <img src={leftIndentIcon} alt="" className="w-3.5" />
                        <div className="bg-[#E1E1E1] flex items-center rounded-sm gap-2 px-2 cursor-pointer">
                          <select
                            className="bg-transparent outline-none cursor-pointer text-sm appearance-none"
                            value={profile.indent.N}
                            onChange={(e) => handleProfileChange(index, 'indent', Number(e.target.value))}
                          >
                            <option value={0}>1</option>
                            <option value={1}>2</option>
                            <option value={2}>3</option>
                            <option value={3}>4</option>
                            <option value={4}>5</option>
                            <option value={5}>6</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex pl-5 justify-between">
                      {/* Bold */}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].bold.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={(e) => handleProfileChange(index, 'bold', !localProfile[index].bold.BOOL)}
                      >
                        <img src={boldIcon} alt="" className="w-3" />
                      </div>

                      {/* Italic */}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].italic.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={(e) => handleProfileChange(index, 'italic', !localProfile[index].italic.BOOL)}
                      >
                        <img src={italicIcon} alt="" className="w-3" />
                      </div>

                      {/* Undeline */}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].underline.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={(e) => handleProfileChange(index, 'underline', !localProfile[index].underline.BOOL)}
                      >
                        <img src={underlineIcon} alt="" className="w-3" />
                      </div>

                      {/* Strikethrough */}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].strike.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={(e) => handleProfileChange(index, 'strike', !localProfile[index].strike.BOOL)}
                      >
                        <img src={strikethroughIcon} alt="" className="w-3" />
                      </div>

                      {/* Unordered List */}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].list.S === 'bullet' ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={() =>
                          handleProfileChange(
                            index,
                            'list',
                            localProfile[index].list.S === 'bullet' ? '' : 'bullet'
                          )
                        }
                      >
                        <img src={unorderedListIcon} alt="" className="w-4" />
                      </div>

                      {/* Ordered List*/}
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].list.S === 'ordered' ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                        onClick={() =>
                          handleProfileChange(
                            index,
                            'list',
                            localProfile[index].list.S === 'ordered' ? '' : 'ordered'
                          )
                        }
                      >
                        <img src={orderedListIcon} alt="" className="w-4" />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            <div className="row-start-2 col-start-3 bg-red flex justify-end items-start">
              <button
                type="button"
                onClick={handleAddProfileField}
                className="px-8 py-2 font-sserif bg-[#E1E1E1] text-[#383838] rounded-md mr-4 mt-4"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-2 font-sserif bg-[#FFBF8F] text-[#FFFFFF] rounded-md mt-4"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )
      }
    </div >
  )
}


export default ControlBar;