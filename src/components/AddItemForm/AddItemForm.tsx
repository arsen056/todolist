import React, {ChangeEvent, FC, memo, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import styled from "styled-components";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    label: string
}

export const AddItemForm:FC<AddItemFormPropsType> = memo(({addItem, label}) => {
    const [value, setValue] = useState<string>('')
    const [error, serError] = useState<boolean>(false)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if (value.trim()) serError(false)
        setValue(value)
    }

    const onClick = () => {
        if(value.trim()) {
            setValue('')
            addItem(value)
            return
        }
        serError(true)
    }

    return (
        <AddItemWrapper>
            <TextField
                id="standard-basic"
                label={label}
                variant="standard"
                onChange={onChange}
                value={value}
                error={error}
                helperText={error ? 'Incorrect value' : ' '}
                sx={{
                    flexGrow:1
                }}
            />
            <IconButton aria-label="Add" onClick={onClick}>
                <AddBoxIcon fontSize="large" />
            </IconButton>

        </AddItemWrapper>
    );
});

const AddItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`