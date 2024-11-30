import React, { useState, useRef, useEffect } from "react";
import cottageIcon from "../../assets/images/cottage.svg";
import searchIcon from "../../assets/images/search-gr.svg";
import palletIcon from "../../assets/images/pallet-gr.svg";
import zoomInIcon from "../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../assets/images/zoom-out.svg";
import { HighlightColorProfileProps } from "./ContextMenu";

interface ControlBarProps {
  setPdfScaleValue: (value: number) => void;
  highlightColorProfile: HighlightColorProfileProps[];
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
  highlightColorProfile
 }: ControlBarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [profileConfigPopup, setProfileConfigPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [fields, setFields] = useState<Field[]>([]);

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

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setProfileConfigPopup(false);
    }
  };

  const handleHighlightColorChange = (index: number, color: string) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, highlightColor: color } : field
      )
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddField = () => {
    setFields((prevFields) => [
      ...prevFields,
      {
        id: prevFields.length,
        highlightColor: "",
        font: "",
        textColor: "",
        textBackgroundColor: "",
        fontSize: "",
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        align: "left",
        indent: 0,
      },
    ]);
  };

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen ">
      <div className="flex flex-col gap-5 p-[10px] ">

        <a href="/files" className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
          <img src={cottageIcon} alt="home-icon" className="cursor-pointer w-7" />
        </a>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] focus:bg-[#FFE7D4]">
          <img src={searchIcon} alt="search icon" className="cursor-pointer w-7" />
        </div>
        <div className={`p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] ${profileConfigPopup === true ? 'bg-[#FFE7D4]' : ''}`}
          onClick={() => setProfileConfigPopup(!profileConfigPopup)}
        >
          <img src={palletIcon} alt="color-pallete icon" className="cursor-pointer w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]" onClick={zoomIn}>
          <img src={zoomInIcon} alt="zoom-in-icon" className="cursor-pointer w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]" onClick={zoomOut}>
          <img src={zoomOutIcon} alt="zoom-out-icon" className="cursor-pointer w-7" />
        </div>
      </div>
      <div className="flex flex-col px-2 text-center pt-5">
        <div className="bg-white rounded-md">1</div>
        <p className="text-sm">of 57</p>
      </div>
      {profileConfigPopup && (
        <div
          ref={popupRef}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3/5 h-3/4 font-sserif bg-[#F4F4F4] border border-gray-300 shadow-lg rounded-md p-4 z-10 overflow-y-auto"
        >
          {/* Render all dynamically added fields */}
          {highlightColorProfile.map((profile, index) => (
            <div
              key={profile.configID.S}
              className="w-2/5 border border-gray-300 rounded-md p-4 my-2 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex justify-center items-center cursor-pointer"
                  style={{ backgroundColor: profile.configColor.S }}
                >
                  <input
                    type="color"
                    name="highlightColor"
                    className="opacity-0 w-full h-full cursor-pointer"
                    value={profile.configColor.S}
                    onChange={(e) => handleHighlightColorChange(index, e.target.value)}
                  />
                </div>
                <label className="rounded-sm bg-[#E1E1E1]">
                  {profile.configColor.S}
                </label>
              </div>



              {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Highlight Color
                  </label>
                  <input
                    type="color"
                    name="highlightColor"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
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
            </div>
          ))}

          {/* Add button to dynamically create new fields */}
          <button
            type="button"
            onClick={handleAddField}
            className="px-8 py-2 font-sserif bg-[#E1E1E1] text-[#383838] rounded-md mt-4"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export default ControlBar;