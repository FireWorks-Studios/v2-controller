import React from "react";
import './Button.css';
import { ComponentRepresentation } from '../ControllerContainer/ControllerContainer';
import { Button } from "./Button";

interface Props{
    unitWidth: number;
    component: ComponentRepresentation;
    validDropCancelTransition: boolean;
}



export const DummyButton: React.FC<Props> = ({
    unitWidth,
    component,
    validDropCancelTransition = false
}:Props)=>{

    return(
        <div>
        <Button
            variant="static-dummy"
            component={component}
            unitWidth={unitWidth}
            editing={true}
        />
        <Button
            variant="draggable-dummy"
            component={component}
            unitWidth={unitWidth}
            editing={true}
            noTransition={validDropCancelTransition}
        />
        </div>
    )
}
