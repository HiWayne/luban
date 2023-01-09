import { FC, ReactNode } from "react";
import styled from "styled-components"

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`
interface ConfigAreaProp {
    children: ReactNode | ReactNode[];
}
export const ConfigArea: FC<ConfigAreaProp> = ({ children }) => {
    return <Wrapper>{children}</Wrapper>
}