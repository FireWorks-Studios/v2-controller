import { ComponentRepresentation } from "../components/ControllerContainer/ControllerContainer"

export const keyDict: Record<string, number> = {
    'ArrowUp':38,
    'ArrowDown':40,
    'ArrowLeft':37,
    'ArrowRight':39,
    ' ':32,
    'w':87,
    'a':65,
    's':83,
    'd':68,
    'z':90,
    'x':88,

    'b':66,
    'c':67,
    'e':69,
    'f':70,
    'g':71,
    'h':72,

    'i':73,
    'j':74,
    'k':75,
    'l':76,
    'm':77,
    'n':78,
    'o':79,
    'p':80,
    'q':81,
    'r':82,
    't':84,
    'u':85,
    'v':86,
    'y':89,

    '0':48,
    '1':49,
    '2':50,
    '3':51,
    '4':52,
    '5':53,
    '6':54,
    '7':55,
    '8':56,
    '9':57

}

export const centerDefaultComponentRepresentations:ComponentRepresentation[] = 
[
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowUp",
      "container": "center",
      "x": 1,
      "y": 0,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowLeft",
      "container": "center",
      "x": 0,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowDown",
      "container": "center",
      "x": 1,
      "y": 2,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowRight",
      "container": "center",
      "x": 2,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "a",
      "container": "center",
      "x": 5,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "b",
      "container": "center",
      "x": 4,
      "y": 2,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  }
]

 export const leftDefaultComponentRepresentations:ComponentRepresentation[] = 
  [
    {
        "type": "button",
        "styling": [],
        "mapping": "w",
        "container": "left",
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "a",
        "container": "left",
        "x": 0,
        "y": 1,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "s",
        "container": "left",
        "x": 1,
        "y": 2,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "d",
        "container": "left",
        "x": 2,
        "y": 1,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "e",
        "container": "left",
        "x": 2,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "f",
        "container": "left",
        "x": 0,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "1",
        "container": "left",
        "x": 0,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "2",
        "container": "left",
        "x": 1,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "3",
        "container": "left",
        "x": 2,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "4",
        "container": "left",
        "x": 0,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "5",
        "container": "left",
        "x": 1,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "6",
        "container": "left",
        "x": 2,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "7",
        "container": "left",
        "x": 0,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "8",
        "container": "left",
        "x": 1,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "9",
        "container": "left",
        "x": 2,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    }
]

 export const rightDefaultComponentRepresentations:ComponentRepresentation[] = 
  [
    {
        "type": "button",
        "styling": [],
        "mapping": "Space",
        "container": "right",
        "x": 0,
        "y": 1,
        "w": 3,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "o",
        "container": "right",
        "x": 0,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "p",
        "container": "right",
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "e",
        "container": "right",
        "x": 2,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    }
]