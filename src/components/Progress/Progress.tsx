import React from 'react';
import {CircularProgress} from "@mui/material";
import styled from "styled-components";

export const Progress = () => {
    return (
        <ProgressWrapper>
            <CircularProgress/>
        </ProgressWrapper>
    );
};

const ProgressWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% -50%);  
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 15;
`

