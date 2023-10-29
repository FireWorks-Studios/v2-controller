import type { Meta, StoryObj } from '@storybook/react';

import { ControllerContainer } from '../components/ControllerContainer/ControllerContainer';

const meta = {
    title: 'Control/ControllerContainer',
    component: ControllerContainer,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
    }
} satisfies Meta<typeof ControllerContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CenterControllerContainer: Story = {
    args:{
        position: "center",
        unitWidth: 50,
        controlConfig: [
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 1,
                y: 0 
            },
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 0,
                y: 1 
            },
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 1,
                y: 2 
            },
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 2,
                y: 1 
            },
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 5,
                y: 1 
            },
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 4,
                y: 2 
            }
        ],
        editing: false
    }
}

export const LeftControllerContainer: Story = {
    args:{
        position: "left",
        unitWidth: 50,
        controlConfig: [
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 0,
                y: 0 
            }
        ],
        editing: false
    }
}

export const RightControllerContainer: Story = {
    args:{
        position: "right",
        unitWidth: 50,
        controlConfig: [
            {
                type: "button",
                mapping: "UpArrow",
                container: "center",
                x: 0,
                y: 0 
            }
        ],
        editing: false
    }
}