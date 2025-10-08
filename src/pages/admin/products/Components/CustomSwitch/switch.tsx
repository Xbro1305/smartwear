import * as React from 'react'

interface SwitchProps {
  onClick: (value: boolean) => void
  value: boolean
}

export const CustomSwitch: React.FC<SwitchProps> = ({ onClick, value }) => {
  return (
    <div
      className={`p-[2px] cursor-pointer border-solid border-[#DFE2EB] rounded-[25px] border-[1px] relative h-[28px] w-[46px] ${value ? 'bg-[#E02844]' : 'bg-[#E9ECF5]'}`}
      onClick={() => onClick(!value)}
    >
      <div
        className={`w-[22px] h-[22px] bg-white rounded-[50%] display-block transition-all duration-[0.3s] transition-ease ${value && 'translate-x-[calc(100%-4px)]'}`}
      ></div>
    </div>
  )
}
