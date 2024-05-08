import styled from 'styled-components';

interface ColorDot {
    collectionColor?: string;
}

// export const ColorSelectItem = styled(MenuItem)`
//     // display: inline-flex;
//     // width: 50%;
//     // justify-content: center;
//     // align-items: center;
// `;

// export const ColorSelected = styled(Select)`
//     display: flex;
// `;
// export const FormControlStyled = styled(FormControl)`
//     display: flex;
// `;

export const ColorDot = styled.span<ColorDot>(
    ({ collectionColor }) => `
    height: 20px;
    width: 20px;
    background-color: ${collectionColor};
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
`
);
