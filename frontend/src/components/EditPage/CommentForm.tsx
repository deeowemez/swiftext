import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (input: string) => void;
  placeHolder?: string;
}
const CommentForm = ({ onSubmit, placeHolder }: CommentFormProps) => {
  const [input, setInput] = useState<string>("");

  return (
    <form
      className="Tip__card bg-[#f4f4f4] rounded-md border border-[#d6d6d6]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(input);
      }}
    >
      <div className="min-h-[150px] p-2">
        <textarea
          className="min-h-[150px] bg-[#f4f4f4] border rounded-md border-[#d6d6d6] p-1"
          placeholder={placeHolder}
          autoFocus
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <div className="flex justify-end items-center pt-1">
          <input type="submit" value="✔" className="text-xs px-2 py-1 font-sserif bg-[#FFBF8F] text-[#FFFFFF] rounded-full cursor-pointer" />
        </div>
      </div>
      
    </form>
  );
};

export default CommentForm;
