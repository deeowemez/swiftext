import React, { useState, useRef, useEffect } from "react";
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
import { HighlightColorProfileProps } from "./ContextMenu";


interface ControlBarProps {
  setPdfScaleValue: (value: number) => void;
  highlightColorProfile: HighlightColorProfileProps[];
  // saveProfileToDatabase: (updatedProfile: HighlightColorProfileProps[]) => void;
}


interface Field {
  id: number;
  highlightColor: string;
  font: string;
  textColor: string;
  textBackgroundColor: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: string;
  indent: number;
}


const ControlBar = ({
  setPdfScaleValue,
  highlightColorProfile,
  // saveProfileToDatabase
}: ControlBarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [profileConfigPopup, setProfileConfigPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [localProfile, setLocalProfile] = useState<HighlightColorProfileProps[]>([]);
  const [selectedFont, setSelectedFont] = useState("");


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


  useEffect(() => {
    console.log("Local profile updated:", localProfile);
  }, [localProfile]);  // Dependency array ensures this runs when localProfile changes


  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setProfileConfigPopup(false);
    }
  };


  const handleHighlightColorChange = (index: number, color: string) => {
    setLocalProfile((prevProfile) =>
      prevProfile.map((item, i) =>
        i === index ? { ...item, configColor: { S: color } } : item
      )
    );
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
            return { ...item, [key]: value };
          }
        }
        return item;
      })
    );
  };

  const handleSubmit = () => {
    // saveProfileToDatabase(localProfile);
    setProfileConfigPopup(false); // Close popup after saving
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
      {profileConfigPopup && (
        <div
          ref={popupRef}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[65%] h-3/4 font-sserif bg-[#F4F4F4] border border-gray-300 shadow-lg rounded-md p-10 z-10 overflow-y-auto"
        >
          <form onSubmit={handleSubmit}>
            {/* Render all dynamically added fields */}
            <div className="flex flex-wrap gap-2">
              {localProfile.map((profile, index) => (
                <div key={profile.configID.S} className="w-[49%] border border-gray-300 rounded-md p-4 shadow-sm flex bg-[#EEEEEE]">

                  {/* Highlight Color */}
                  <div className="flex flex-col gap-2 items-center">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
                      style={{ backgroundColor: profile.configColor.S }}
                    >
                      <input
                        type="color"
                        name="highlightColor"
                        className="opacity-0 w-full h-full cursor-pointer"
                        value={profile.configColor.S}
                        onChange={(e) => handleProfileChange(index, 'color', e.target.value)}
                      />
                    </div>
                    <label className="rounded-sm bg-[#E1E1E1] text-center px-2 mb-1">
                      {profile.configColor.S}
                    </label>
                    <div className="rounded-sm bg-[#E1E1E1] text-center px-3">
                      Remove
                    </div>
                  </div>

                  {/* Font */}
                  <div className="p-3 w-full">
                    <div className="flex gap-2 mb-3">
                      <img src={fontIcon} alt="" className="w-3" />
                      <div className="bg-[#E1E1E1] w-full flex flex-1 items-center rounded-sm gap-2 px-2 cursor-pointer">
                        <select
                          className="bg-transparent w-full outline-none cursor-pointer"
                          value={profile.font.S}
                          onChange={(e) => handleProfileChange(index, 'font', e.target.value)}
                        >
                          <option value="sans-serif">Sans Serif</option>
                          <option value="serif">Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between mb-2">
                      {/* Text Color */}
                      <div className="flex gap-2">
                        <img src={textColorIcon} alt="" className="w-3" />
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
                          {/* <label className="text-center text-xs">
                            {profile.color.S}
                          </label> */}
                        </div>
                      </div>

                      {/* Text Background Color */}
                      <div className="flex gap-2 ">
                        <img src={textBackgroundColorIcon} alt="" className="w-3" />
                        <div className="rounded-sm bg-[#E1E1E1] flex items-center justify-center px-2 gap-1">
                          <div
                            className="w-2 h-2 overflow-hidden flex justify-center items-center cursor-pointer"
                            style={{ backgroundColor: profile.backgroundColor.S }}
                          >
                            <input
                              type="color"
                              name="highlightColor"
                              className="opacity-0 w-full h-full cursor-pointer"
                              value={profile.backgroundColor.S}
                              onChange={(e) => handleProfileChange(index, 'backgroundColor', e.target.value)}
                            />
                          </div>
                          <label className="text-center text-xs">
                            {profile.backgroundColor.S}
                          </label>
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="flex gap-2">
                        <img src={fontSizeIcon} alt="" className="w-3" />
                        <div className="bg-[#E1E1E1] flex items-center rounded-sm gap-2 px-2 cursor-pointer">
                          <select
                            className="bg-transparent w-full outline-none cursor-pointer"
                            value={profile.size.S}
                            onChange={(e) => handleProfileChange(index, 'size', e.target.value)}
                          >
                            <option value="small">Small</option>
                            <option value="large">Medium</option>
                            <option value="huge">Large</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
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

                      <div className="flex gap-[2px] w-9 h-6 hover:bg-[#FFE7D4] rounded-md cursor-pointer justify-center items-center">
                        <img src={alignIcon} alt="" className="w-3"/>
                        <img src={arrrowDownIcon} alt="" className="w-[9px]"/>
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* <div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font</label>
                  <input
                    type="text"
                    name="font"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    name="textColor"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Text Background Color
                  </label>
                  <input
                    type="color"
                    name="textBackgroundColor"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Font Size
                  </label>
                  <input
                    type="number"
                    name="fontSize"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bold</label>
                  <input
                    type="checkbox"
                    name="bold"
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Italic
                  </label>
                  <input
                    type="checkbox"
                    name="italic"
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Underline
                  </label>
                  <input
                    type="checkbox"
                    name="underline"
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Strikethrough
                  </label>
                  <input
                    type="checkbox"
                    name="strikethrough"
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Text Align
                  </label>
                  <select
                    name="align"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Indent</label>
                  <input
                    type="number"
                    name="indent"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div> */}


            {/* <button
            type="button"
            onClick={handleAddField}
            className="px-8 py-2 font-sserif bg-[#E1E1E1] text-[#383838] rounded-md mr-4 mt-4"
          >
            Add
          </button> */}
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-2 font-sserif bg-[#FFBF8F] text-[#FFFFFF] rounded-md mt-4"
            >
              Save
            </button>
          </form>
        </div>
      )
      }
    </div >
  )
}


export default ControlBar;