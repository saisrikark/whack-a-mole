import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

const reloadInterval = 5000;
const updateInterval = 500;
const rows = 5;
const columns = 5;

function MoleGrid() {

    let points = 0;
    let gridWordVals: string[] = [];
    let gridWhackVals: number[] = [];

    let [currGrid, setCurrGrid] = useState(<div></div>);
    let [currPoints, setCurrPoints] = useState(points);

    async function whack(row: number, column: number) {
        let index = getIndex(row, column);
        let res = Number(await invoke("result", {"row":row, "column": column, "element": gridWhackVals[index]}));
        
        if (res > 0) {
            gridWordVals[index] = "❎";
        } else {
            gridWordVals[index] = "❌";
        }
        gridWhackVals[index] = 0;

        points += res;
        setCurrPoints(points);
    }

    const getIndex = (row: number, column: number) => {
        return (row * columns) + column;
    }

    const newButton = (row: number, column: number) => {
        return (
                <Button className='Element' variant="outlined" 
                style={{maxWidth: '100px', maxHeight: '100px', minWidth: '100px', minHeight: '100px'}}
                    onClick={() => {
                        whack(row, column)}}>
                            {gridWordVals[getIndex(row, column)]
                }</Button>
            )
    }

    const updateGrid = () => {
        if (gridWordVals.length < 1) {
            return
        } 

        let grids = [];
        for (let i = 0; i < rows; i++) {
            let buttons = [];
            for(let j = 0; j < columns; j++) {
                let button = newButton(i, j);
                buttons.push(button);
            }
            grids.push(<Grid>{buttons}</Grid>);
        }

        setCurrGrid(<Stack>{grids}</Stack>);
    }

    const getRandomizedVal = () => {
        let rand = Math.random() * 100
        let ret = {
            word: "🍪",
            whack: 0,
        }

        switch (true) {
            case rand < 25:
                ret.word = "🐗";
                ret.whack = 1;
                break;
            case rand < 35:
                ret.word = "🐕";
                ret.whack = -1;
                break;  
        }

        return ret;
    }

    const generateGrid = () => {

        let tempGridWordVals: string[] = [];
        let tempGridWhackVals: number[] = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let val = getRandomizedVal();
                tempGridWordVals.push(val.word);
                tempGridWhackVals.push(val.whack);
            }
        }

        gridWordVals = tempGridWordVals;
        gridWhackVals = tempGridWhackVals;
        updateGrid();
    }


    useEffect(() => {
        const generateOnloadID = setInterval(() => {
            generateGrid();
        }, reloadInterval);
        const updateGridID = setInterval(() => {
            updateGrid();
        }, updateInterval);
        return () => {
            clearInterval(generateOnloadID);
            clearInterval(updateGridID);
        }
    }, [])

    return (
        <div className='MoleGrid'>
            {currGrid}
            <h1>Points: {currPoints}</h1>
        </div>
    )
}

export default MoleGrid;