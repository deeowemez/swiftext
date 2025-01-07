import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import axios, { AxiosError } from "axios";
import cottageIcon from "../../assets/images/cottage.svg";
import searchIcon from "../../assets/images/search-gr.svg";
import palletIcon from "../../assets/images/pallet-gr.svg";
import zoomInIcon from "../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../assets/images/zoom-out.svg";
import trashCanIcon from "../../assets/images/trash-can.svg";
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
import IcontipButton from "./IcontipButton";
import { HighlightColorProfileProps } from "./ContextMenu";
import { CommentedHighlight } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./EditPage";

interface ControlBarProps {
  currentUser: User | null;
  forceRenderProfile: boolean;  // Now using boolean to track the profile selection state
  setForceRenderProfile: (value: boolean) => void;
  setPdfScaleValue: (value: number) => void;
  highlightColorProfile: HighlightColorProfileProps[];
  highlights: Array<CommentedHighlight>;
  setHighlights: (highlights: Array<CommentedHighlight>) => void;
  showResetHighlightsWarning: boolean;
  setShowResetHighlightsWarning: Dispatch<SetStateAction<boolean>>;
  resetHighlights: () => void;
}

const ControlBar = ({
  currentUser,
  highlights,
  setHighlights,
  forceRenderProfile,
  setForceRenderProfile,
  setPdfScaleValue,
  showResetHighlightsWarning,
  setShowResetHighlightsWarning,
  highlightColorProfile,
  resetHighlights,
}: ControlBarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [profileConfigPopup, setProfileConfigPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
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
    console.log('highlightcolorprofile: ', highlightColorProfile);
    setLocalProfile([...highlightColorProfile]);
  }, [highlightColorProfile]);

  const handleAddProfileField = () => {
    
    const newField: HighlightColorProfileProps = {
      userID: { S: currentUser?.userID ?? "defaultUserID" },
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
      if (localProfile.length > 15) {
        console.error("Profile exceeds the maximum limit of 15 items.");
        alert("You can only have a maximum of 15 items in your profile.");
        return; // Exit the function if the limit is exceeded
      }
      const currentColorMap = profileColorMap(highlightColorProfile);
      const response = await axios.post(`http://localhost:5000/api/profile/save?userID=${currentUser?.userID}`, { items: localProfile });
      setForceRenderProfile(!forceRenderProfile);
      if (response.data.success) {

        // Check for changes in the color map
        const updatedColorMap = profileColorMap(localProfile);

        const changedColors: Record<string, string> = Object.keys(currentColorMap).reduce((acc, key) => {
          if (currentColorMap[key] !== updatedColorMap[key]) {
            // If color has changed, store the key and updated color
            acc[key] = updatedColorMap[key];
          }
          // console.log('acc', acc);
          return acc;
        }, {} as Record<string, string>);

        // console.log('changed colors: ', changedColors);
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
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen font-sserif">
      <div className="flex flex-col gap-5 p-[10px] h-screen">
        <a href="/files">
          <IcontipButton className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
            icon={cottageIcon} iconSize="w-7" altText="home-icon" tooltipText="Home" direction="right" />
        </a>
        <IcontipButton className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
          icon={searchIcon} iconSize="w-7" altText="search-icon" tooltipText="Search" direction="right" />
        <IcontipButton
          className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
          icon={palletIcon}
          iconSize="w-7"
          altText="color-palette-icon"
          tooltipText="Color Profile"
          onClick={() => setProfileConfigPopup((prev) => !prev)}
          direction="right"
        />
        <IcontipButton className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
          icon={zoomInIcon} iconSize="w-7" altText="zoom-in-icon" tooltipText="Zoom In" onClick={zoomIn} direction="right" />
        <IcontipButton className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
          icon={zoomOutIcon} iconSize="w-7" altText="zoom-out-icon" tooltipText="Zoom Out" onClick={zoomOut} direction="right" />
        <div className="mt-auto">
          <IcontipButton
            className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#fdcbcb] cursor-pointer"
            icon={trashCanIcon}
            iconSize="w-7"
            altText="trash-can-icon"
            tooltipText="Delete all Highlights"
            onClick={() => { setShowResetHighlightsWarning(!showResetHighlightsWarning) }}
            direction="right"
          />
        </div>
      </div>
      {profileConfigPopup && (
        <>
        <div className="fixed inset-0 bg-[#F4F4F4] opacity-0 z-20 " />
          <div
            ref={popupRef}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
          w-[70%] lg:w-[70%] xl:w-[70%] h-3/4 font-sserif bg-[#F4F4F4] border border-[#C1C1C1] shadow-lg rounded-md px-10 py-8 z-20 overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="grid md:grid-rows-[88%_12%] lg:grid-rows-[90%_10%] w-full h-full">
              {/* Render all dynamically added fields */}
              <div className="row-start-1 flex flex-wrap content-start items-start justify-center xl:justify-start gap-3 overflow-x-auto border border-gray-300 rounded-lg p-5">
                {localProfile.map((profile, index) => (
                  <div key={profile.configID.S} className="w-full max-w-[390px] h-[140px] border border-gray-300 rounded-md p-4 shadow-sm flex bg-[#EEEEEE] overflow-hidden">
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
                      <label className="rounded-sm bg-[#E1E1E1] text-center px-2 mb-2">
                        {profile.configColor.S.toUpperCase()}

                      </label>
                      <button
                        onClick={() => handleRemoveProfile(index)}
                        className="remove-button bg-[#E1E1E1] text-[#333333] px-3 rounded hover:text-[#FE3E3E]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="px-3 py-1.5 w-full">
                      {/* Font */}
                      {/* <div className="flex gap-2 mb-4">
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
                    </div> */}

                      <div className="flex justify-between mb-4">
                        {/* Text Color */}
                        <div className="flex gap-1.5 items-center">
                          <IcontipButton icon={textColorIcon} iconSize="w-3.5" altText="text-color-icon" tooltipText="Text Color" direction="left" />
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
                        <div className="flex gap-1.5 items-center">
                          <IcontipButton icon={textBackgroundColorIcon} iconSize="w-3.5" altText="text-bg-color-icon" tooltipText="Text Background Color" direction="left" />
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
                              {profile.background.S === '' ? 'None' : profile.background.S.toUpperCase()}
                            </label>
                          </div>
                        </div>

                        {/* Header
                      <div className="flex gap-1.5 items-center">
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
                      </div> */}
                      </div>

                      <div className="flex justify-between mb-4">
                        {/* Font Size */}
                        <div className="flex gap-1.5 items-center">
                          <IcontipButton icon={fontSizeIcon} iconSize="w-3.5" altText="font-size-icon" tooltipText="Font Size" direction="left" />
                          <div className="bg-[#E1E1E1] flex items-center rounded-sm gap-2 px-2 cursor-pointer">
                            <select
                              className="bg-transparent outline-none cursor-pointer text-sm appearance-none"
                              value={profile.size.S}
                              onChange={(e) => handleProfileChange(index, 'size', e.target.value)}
                            >
                              <option value="small">Small</option>
                              <option value="normal">Medium</option>
                              <option value="large">Large</option>
                              <option value="huge">Huge</option>
                            </select>
                          </div>
                        </div>

                        {/* Text Alignment*/}
                        <div className="flex gap-1.5 items-center">
                          <IcontipButton icon={alignIcon} iconSize="w-3.5" altText="align-icon" tooltipText="Text Alignment" direction="left" />
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
                        <div className="flex gap-1.5 items-center">
                          <IcontipButton icon={alignIcon} iconSize="w-3.5" altText="align-icon" tooltipText="Text Alignment" direction="left" />
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
                          <IcontipButton icon={boldIcon} iconSize="w-3" altText="bold-icon" tooltipText="Bold" direction="top" />
                        </div>

                        {/* Italic */}
                        <div
                          className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].italic.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                          onClick={(e) => handleProfileChange(index, 'italic', !localProfile[index].italic.BOOL)}
                        >
                          <IcontipButton icon={italicIcon} iconSize="w-3" altText="italic-icon" tooltipText="Italic" direction="top" />
                        </div>

                        {/* Undeline */}
                        <div
                          className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].underline.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                          onClick={(e) => handleProfileChange(index, 'underline', !localProfile[index].underline.BOOL)}
                        >
                          <IcontipButton icon={underlineIcon} iconSize="w-3" altText="underline-icon" tooltipText="Underline" direction="top" />
                        </div>

                        {/* Strikethrough */}
                        <div
                          className={`w-6 h-6 flex justify-center items-center rounded-md cursor-pointer ${localProfile[index].strike.BOOL ? 'bg-[#FFE7D4]' : 'hover:bg-[#FFE7D4]'}`}
                          onClick={(e) => handleProfileChange(index, 'strike', !localProfile[index].strike.BOOL)}
                        >
                          <IcontipButton icon={strikethroughIcon} iconSize="w-3" altText="strikethrough-icon" tooltipText="Strikethrough" direction="top" />
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
                          <IcontipButton icon={unorderedListIcon} iconSize="w-3" altText="unordered-list-icon" tooltipText="Unordered List (Bullets)" direction="top" />
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
                          <IcontipButton icon={orderedListIcon} iconSize="w-3" altText="ordered-list-icon" tooltipText="Ordered List (Numbers)" direction="top" />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
              <div className="row-start-2 bg-red flex justify-end items-start">
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
        </>
      )
      }
    </div >

  )

}



export default ControlBar;