import { FC } from "react";
import styled from "styled-components"
// import componentIcon from '../assets/componentIcon.svg'
import useStore from '@/frontend/store';
import { NodeAST } from '@/backend/types/frontstage/index';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    border: 1px solid #e3e6eb;
    box-sizing: border-box;
    border-radius: 3px;
    padding: 0 8px;
`

const Name = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #13161b;
    cursor: grab;
`

// const Image = styled.img`
//     width: 16px;
//     height: 16px;
//     margin-right: 8px;
// `

interface ComponentItemProp {
    name: string;
    type:
    | 'BlockContainer'
    | 'InlineContainer'
    | 'FlexContainer'
    | 'GridContainer'
    | 'ScrollList'
    | 'Image'
    | 'Text'
    | 'Paragraph';
    defaultAST: NodeAST;
}

export const ComponentItem: FC<ComponentItemProp> = ({ name, type, defaultAST }) => {

    const addAST = useStore((state) => state.editor.addAst)
    const addAAST = () => {
        addAST({
            id: 13,
            type,
            props: defaultAST.props
        })
    }
    return <Wrapper draggable onClick={addAAST}>
        {/* <Image src={icon} alt="小图标" /> */}
        <Name>{name}</Name>
    </Wrapper>
}