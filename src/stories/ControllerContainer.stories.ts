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
        defaultConfig:         [
            {
              type: "button",
              styling: [],
              mapping: 'ArrowUp',
              container: "center",
              x: 1,
              y: 0,
              w: 1,
              h: 1 
          },
          {
            type: "button",
            styling: ["round", "short"],
            mapping: 'Green Flag',
            container: "center",
            x: 2,
            y: 0,
            w: 1,
            h: 1  
        },
        {
            type: "button",
            styling: ["round", "short"],
            mapping: 'Pause',
            container: "center",
            x: 3,
            y: 0 ,
            w: 1,
            h: 1  
        },
        {
          type: "button",
          styling: ["round", "short"],
          mapping: 'Stop',
          container: "center",
          x: 4,
          y: 0,
          w: 1,
          h: 1   
      },
          {
              type: "button",
              styling: [],
              mapping: 'ArrowLeft',
              container: "center",
              x: 0,
              y: 1,
              w: 1,
              h: 1   
          },
          {
              type: "button",
              styling: [],
              mapping: 'ArrowDown',
              container: "center",
              x: 1,
              y: 2,
              w: 1,
              h: 1   
          },
          {
              type: "button",
              styling: [],
              mapping: 'ArrowRight',
              container: "center",
              x: 2,
              y: 1,
              w: 1,
              h: 1   
          },
          {
              type: "button",
              styling: [],
              mapping: 'a',
              container: "center",
              x: 5,
              y: 1,
              w: 1,
              h: 1   
          },
          {
            type: "button",
            styling: [],
            mapping: 'b',
            container: "center",
            x: 4,
            y: 2,
            w: 1,
            h: 1   
          },
          ],
        editing: false
    }
}
