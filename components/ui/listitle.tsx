import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";

export interface ListTitleType {
  title?: React.ReactNode;
  leading?: React.ReactNode;
  actions?: React.ReactNode[];
  onClick?: () => void;
  className?: string;
  subTitle?: React.ReactNode;
  listTitleStyle?: React.CSSProperties;
  leadingStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  actionsStyle?: React.CSSProperties;
  mainTextStyle?: React.CSSProperties;
  leftStyle?: React.CSSProperties;
}

const ListTitle = ({
  title,
  leading,
  actions,
  onClick,
  className,
  subTitle,
  titleStyle,
  listTitleStyle,
  leadingStyle,
  actionsStyle,
  subtitleStyle,
  mainTextStyle,
  leftStyle,
}: ListTitleType) => {
  return (
    <div
      style={listTitleStyle}
      onClick={onClick}
      className={cn(
        `${onClick ? "touch-opacity" : ""}  justify-between flex text-color py-[15px] px-[12px]  gap-[10px] w-full bg-[varr(--second-color)]  flex-row `,
        className,
      )}
    >
      <div
        style={leftStyle}
        className="flex items-start flex-row items-center justify-start gap-[10px]"
      >
        <div
          style={leadingStyle}
          className=" h-full  leading flex items-center  "
        >
          {leading ?? <ChevronLeft />}
        </div>

        <div
          style={mainTextStyle}
          className="flex h-full  gap-[2px] items-start  justify-center w-full flex-col "
        >
          <div style={titleStyle} className=" text-nowrap overflow-ellipsis ">
            {title}{" "}
          </div>

          {subTitle && (
            <div
              style={subtitleStyle}
              className="text-color whitespace-nowrap truncate text-nowrap  overflow-ellipsis w-full text-[11px] opacity-[0.75]"
            >
              {subTitle}
            </div>
          )}
        </div>
      </div>
      <div
        style={actionsStyle}
        className="flex gap-[10px] justify-end items-center w-full  flex-row "
      >
        {actions && actions.map((e) => e)}
      </div>
    </div>
  );
};

export default ListTitle;
