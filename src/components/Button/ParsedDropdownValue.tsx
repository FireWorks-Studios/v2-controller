import { DropdownOption } from "./Dropdown"
// import {FaFlag, FaPause, FaGear} from 'react-icons/fa6'
// import { TbOctagonFilled } from "react-icons/tb"

interface Props {
  value: DropdownOption['value']
}

export const ParsedDropdownValue: React.FC<Props> = ({
  value
}: Props) => {
  switch (value) {
    case "ArrowUp":
      return <span className="arrow up">▲</span>
    case "ArrowDown":
      return <span className="arrow down">▲</span>
    case "ArrowLeft":
      return <span className="arrow left">▲</span>
    case "ArrowRight":
      return <span className="arrow right">▲</span>
    case "Space":
      return <>_</>
    // case "Green Flag":
    //   return <FaFlag className="icon"/>
    // case "Pause":
    //   return <FaPause className="icon"/>
    // case "Stop":
    //   return <TbOctagonFilled className="icon"/>
    // case "Remap":
    //   return <FaGear className="icon"/>
    default:
      return <>{value}</>
  }
}
