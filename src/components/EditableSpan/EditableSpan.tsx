import React, {ChangeEvent, FC, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton} from "@mui/material";

type EditableSpanPropsType = {
    changeTitle: (title: string) => void
    title: string
}

export const EditableSpan:FC<EditableSpanPropsType> = ({title, changeTitle}) => {
    const [value, setValue] = useState<string>(title)
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const setEdit = () => setIsEdit(!isEdit)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)

    const changeEditMode = () => {
        changeTitle(value)
        setIsEdit(!isEdit)
    }

    return ( !isEdit
                ? <>
                    <IconButton onClick={setEdit}>
                        <EditIcon/>
                    </IconButton>
                    <span>{title}</span>
                </>
                : <input value={value} type="text" onChange={onChange} onBlur={changeEditMode} autoFocus={true}/>

    );
};
