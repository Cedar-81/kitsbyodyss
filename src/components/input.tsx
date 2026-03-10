import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react"
import React from "react";
import { useLocation } from "react-router";

function Input({ placeholder, type = "text", title, options, disabled = false, optionsLeft, optionsRight, titled = false, textarea= false, dropdown_only = false, value, onChangeInput, onSelectLeft, onSelectRight, defaultSelectedLeft, defaultSelectedRight }: { placeholder?: string, disabled?: boolean, textarea?: boolean, type?: string, title?: string, dropdown_only?: boolean, titled?: boolean, options?: string[], optionsLeft?: string[], optionsRight?: string[], value?: string, onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void, onSelectLeft?: (val: string) => void, onSelectRight?: (val: string) => void, defaultSelectedLeft?: string, defaultSelectedRight?: string }) {
    const [selectedKeysLeft, setSelectedKeysLeft] = React.useState<any>(new Set([defaultSelectedLeft || (optionsLeft ? optionsLeft[0] : "")]));
    const [selectedKeysRight, setSelectedKeysRight] = React.useState<any>(new Set([defaultSelectedRight || (optionsRight ? optionsRight[0] : (options ? options[0] : ""))]));

    // const { activityFormData, updateActivityFormField } = useActivityStore();
    // const { accommodationFormData, updateAccommodationFormField } = useAccommodationStore();

    const location = useLocation();

    console.log(location.pathname);


    const selectedValueLeft = React.useMemo(
        () => Array.from(selectedKeysLeft).join(", ").replace(/_/g, ""),
        [selectedKeysLeft],
    );

    const selectedValueRight = React.useMemo(
        () => Array.from(selectedKeysRight).join(", ").replace(/_/g, ""),
        [selectedKeysRight],
    );

  return (
    <div className={`p-3 px-4 rounded-xl bg-gray-100 w-full ${dropdown_only ? "flex items-center justify-between" : ""}`}>
        {titled && <h2 className="text-sm font-semibold text-[#3E3E3E]">{title}</h2>}
        <div className={"flex items-center gap-2 max-w-full"}>
            {optionsLeft && <Dropdown>
                <DropdownTrigger>
                    <Button className={`capitalize outline-none! cursor-pointer border-none! flex items-center`} variant="solid" size="sm">
                        <p>{selectedValueLeft}</p>
                        <svg width="24" height="24" className="size-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Left dropdown selection"
                    selectedKeys={selectedKeysLeft}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={(keys: any) => {
                        setSelectedKeysLeft(keys);
                        const val = Array.from(keys).join(", ").replace(/_/g, "");
                        onSelectLeft?.(val);
                    }}
                >
                    {optionsLeft?.map((option) => (
                        <DropdownItem key={option}>{option}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>}
            {!dropdown_only && !textarea && <input value={value} disabled={disabled} onChange={onChangeInput} type={type} placeholder={placeholder} className="w-full placeholder:text-[#787878] border-none rounded-md focus:outline-none focus:ring-none bg-transparent" />}
            {textarea && <textarea value={value} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeInput?.(e as any)} placeholder={placeholder} className="w-full placeholder:text-[#787878] border-none h-40 rounded-md focus:outline-none focus:ring-none bg-transparent" />}
            {(optionsRight || options) && <Dropdown>
                <DropdownTrigger>
                    <Button className={`capitalize w-max justify-between cursor-pointer outline-none! border-none! flex items-center ${dropdown_only ? "font-medium py-1" : "font-medium"}`} variant={ dropdown_only ? "solid" : "shadow"} size="sm">
                        <p>{selectedValueRight}</p>
                        <svg width="24" height="24" className="size-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Right dropdown selection"
                    selectedKeys={selectedKeysRight}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={(keys: any) => {
                        setSelectedKeysRight(keys);
                        const val = Array.from(keys).join(", ").replace(/_/g, "");
                        onSelectRight?.(val);
                    }}
                >
                    {(optionsRight || options)?.map((option) => (
                        <DropdownItem key={option}>{option}</DropdownItem>
                    )) || []}
                </DropdownMenu>
            </Dropdown>}
        </div>

    </div>
  )
}

export default Input