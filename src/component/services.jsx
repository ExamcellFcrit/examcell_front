import { sampleProducts } from "./sample-products.jsx";

let data = [...sampleProducts];

const generateId = data =>
    data.reduce((acc, current) => Math.max(acc, current.code), 0) + 1;

export const insertItem = item => {
    item.code = generateId(data);
    item.inEdit = false;
    data.unshift(item);
    return data;
};

export const getItems = () => {
    return data;
};

export const updateItem = item => {
    let index = data.findIndex(record => record.code === item.code);
    data[index] = item;
    return data;
};

export const deleteItem = item => {
    let index = data.findIndex(record => record.code === item.code);
    data.splice(index, 1);
    return data;
};