import { createGlobalStyle } from 'styled-components';

export * from './constants';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }
    body {
        user-select: none;
    }
    [role="luban_component"] {
        & > .name {
            display: none;
        }
        & > .delete {
            display: none;
        }
        & > .parent-selector {
            display: none;
        }
    }
    .editor-highlight {
        position: relative;
        border: 1px solid #409eff;
        transition: all 0.2s ease-out;
        box-shadow: 0 2px 12px 4px rgb(64 158 255 / 20%);
        & > .name {
            display: flex;
            position: absolute;
            left: 0;
            top: 0;
            min-width: 36px;
            height: 18px;
            padding: 4px;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            color: #fff;
            background-color: #409eff;
            box-sizing: border-box;
            user-select: none;
            z-index: 99;
        }
        & > .delete {
            display: flex;
            position: absolute;
            right: -36px;
            top: -1px;
            min-width: 36px;
            height: 18px;
            padding: 4px;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            color: #fff;
            background-color: #ff4d4f;
            box-sizing: border-box;
            cursor: pointer;
            z-index: 99;
        }

        & > .parent-selector {
            display: flex;
            position: absolute;
            right: -68px;
            top: 17px;
            min-width: 36px;
            height: 18px;
            padding: 4px;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            color: #fff;
            background-color: #409eff;
            box-sizing: border-box;
            cursor: pointer;
            z-index: 99;
        }
    }
`;
