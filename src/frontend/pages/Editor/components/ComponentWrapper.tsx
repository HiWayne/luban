import { FC } from "react";
import styled from "styled-components"

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

const Image = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 8px;
`

interface ComponentWrapperProp {
    name: string;
    icon?: string;
}
export const ComponentWrapper: FC<ComponentWrapperProp> = ({ name, icon = 'https://comp-public-1303824488.cos.ap-shanghai.myqcloud.com/lca/comGroup/cg-y9vkmgyuyplh/build/meta/Container/icon.svg' }) => {
    return <Wrapper draggable>
        <Image src={icon} alt="小图标" />
        <Name>{name}</Name>
    </Wrapper>
}