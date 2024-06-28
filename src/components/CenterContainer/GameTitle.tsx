import {FC} from 'react';
import "./GameTitle.css";
import AutoScrollingDiv from './AutoScrollingDiv';


interface GameTitleProps{
}

export const GameTitle: FC<GameTitleProps> = ({
})=>{
    return(
        <AutoScrollingDiv>
        <span id='gameTitleSpan'>Title</span> by <span id='gameAuthorSpan'>Author</span>
      </AutoScrollingDiv>
    )
}