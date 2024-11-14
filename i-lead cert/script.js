// Get the file input element from the HTML
const fileInput = document.getElementById("fileInput");
const { PDFDocument, rgb } = PDFLib;

// Event listener for Excel file upload
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the first uploaded file

    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the Excel file

        // On successful file read
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result); // Convert the result to a byte array
            const workbook = XLSX.read(data, { type: 'array' }); // Read the Excel workbook

            // Get the first sheet name and contents
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert the sheet data to JSON format (array of arrays)
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            displayTable(json); // Display the Excel data in a table
            generateMultiplePDFs(json); // Generate multiple PDFs based on the Excel data
        };

        // Read the file as an array buffer (binary data)
        reader.readAsArrayBuffer(file);
    }
});



// Function to display the Excel data in an HTML table
function displayTable(data) {
    const tableContainer = document.getElementById('table-container'); // Get the table container element
    tableContainer.innerHTML = ''; // Clear any previous tables

    const table = document.createElement('table'); // Create a new table element
    data.forEach((rowData) => { // Loop through each row of data
        const row = document.createElement('tr'); // Create a new table row
        rowData.forEach((cellData) => { // Loop through each cell in the row
            const cell = document.createElement('td'); // Create a new table cell
            cell.textContent = cellData || ''; // Set the cell content (handle empty cells)
            row.appendChild(cell); // Append the cell to the row
        });
        table.appendChild(row); // Append the row to the table
    });

    tableContainer.appendChild(table); // Append the table to the container
}

function getTextPosition(columnStyle, line, fontToUse, textWidth) {
    const initialX = columnStyle.xOffset || 50; // Default starting X position if not provided
    const maxWidth = columnStyle.maxWidth || 400; // Set a maximum width for the text area

    // Check if the line is wider than the allowed width and adjust position if needed
    if (textWidth > maxWidth) {
        return initialX; // In this case, return the default position
    }

    return initialX; // You can further customize this to return other positions based on logic
}

// Function to draw wrapped text with underline
// Function to draw wrapped text with individual xOffset and yOffset
function drawWrappedText(page, text, columnStyle, fontToUse, startX, startY, width) {
    let y = startY + columnStyle.yOffset; // Y position adjustment with yOffset

    // Split the text into words
    const words = text.split(' ');

    // Initialize line
    let line = '';

    // Loop through each word
    words.forEach((word) => {
        // Calculate the width of the current line including the new word
        const textWidth = fontToUse.widthOfTextAtSize(line + (line ? ' ' : '') + word, columnStyle.fontSize);

        // Get the starting X position for this line using the xOffset
        const initialX = startX + columnStyle.xOffset;

        // Define the maximum width allowed
        const maxWidth = columnStyle.maxWidth || width - 20; // Adjust the width as needed

        // If the line width exceeds the max width
        if (textWidth > maxWidth) {
            // Draw the current line
            page.drawText(line, {
                x: initialX, // Use the calculated starting X position with xOffset
                y: y,
                size: columnStyle.fontSize,
                font: fontToUse,
                color: columnStyle.color,
            });

            // Move to the next line
            y -= 8; // Move down for the next line (adjust this value as needed)
            line = word; // Start a new line with the current word
        } else {
            // Add the word to the current line
            line += (line ? ' ' : '') + word;
        }
    });

    // Draw any remaining text in the last line
    if (line) {
        const initialX = startX + columnStyle.xOffset;

        // Draw the last line
        page.drawText(line, {
            x: initialX, // Use the calculated starting X position with xOffset
            y: y,
            size: columnStyle.fontSize,
            font: fontToUse,
            color: columnStyle.color,
        });
    }
}


function drawWrappedTextWithUnderline(page, text, columnStyle, fontToUse, startY, width) {
    let y = startY + columnStyle.yOffset; // Y position adjustment with yOffset

    // No need to split into words for a URL
    const characters = text.split(''); // Split the URL into individual characters

    // Initialize line
    let line = '';

    // Loop through each character
    characters.forEach((char) => {
        // Calculate the width of the current line including the new character
        const textWidth = fontToUse.widthOfTextAtSize(line + char, columnStyle.fontSize);

        // Get the starting X position for this line using the function
        const initialX = getTextPosition(columnStyle, line, fontToUse, textWidth);

        // Define the maximum width allowed
        const maxWidth = columnStyle.maxWidth || width - 20; // Adjust the width as needed

        // If the line width exceeds the max width
        if (textWidth > maxWidth) {
            // Draw the current line
            page.drawText(line, {
                x: initialX, // Use the calculated starting position
                y: y,
                size: columnStyle.fontSize,
                font: fontToUse,
                color: columnStyle.color,
            });

            // Draw the underline for the current line
            drawUnderline(page, initialX, y, line, fontToUse, columnStyle);

            // Move to the next line
            y -= 9; // Move down for the next line (adjust this value as needed)
            line = char; // Start a new line with the current character
        } else {
            // Add the character to the current line
            line += char;
        }
    });

    // Draw any remaining text in the last line
    if (line) {
        const initialX = getTextPosition(columnStyle, line, fontToUse, fontToUse.widthOfTextAtSize(line, columnStyle.fontSize));

        // Draw the last line
        page.drawText(line, {
            x: initialX, // Use the calculated starting position
            y: y,
            size: columnStyle.fontSize,
            font: fontToUse,
            color: columnStyle.color,
        });

        // Draw the underline for the last line
        drawUnderline(page, initialX, y, line, fontToUse, columnStyle);
    }
}




function drawUnderline(page, x, y, text, font, columnStyle) {
    const underlineWidth = font.widthOfTextAtSize(text, columnStyle.fontSize);
    const underlineY = y - 2; // Adjust for underline positioning

    // Draw the underline rectangle
    page.drawRectangle({
        x: x, // Use the calculated starting position
        y: underlineY,
        width: underlineWidth,
        height: 0.5, // Adjust the height for the underline thickness
        color: columnStyle.color,
    });
}


// Function to generate multiple PDF files based on the Excel data
// Function to generate multiple PDF files based on the Excel data
const generateMultiplePDFs = async (tableData) => {
    // Fetch the existing PDF template and font files


    //////
    const existingPdfBytes = await fetch("./temp/ileadcert.pdf").then((res) => res.arrayBuffer());
    const fontRegular = await fetch("./font/Aptos.ttf").then((res) => res.arrayBuffer());
    const fontItalic = await fetch("./font/Aptos-Italic.ttf").then((res) => res.arrayBuffer());
    const fontBold = await fetch("./font/Aptos-Bold.ttf").then((res) => res.arrayBuffer());
    const fontBoldItalic = await fetch("./font/Aptos-Bold-Italic.ttf").then((res) => res.arrayBuffer());

    //////

    // Define primary and black colors for text
    const primaryColor = rgb(0.04, 0.12, 0.38); // Custom dark blue color
    const blackColor = rgb(0, 0, 0); // Pure black color

    // Define custom styles for each column in the Excel sheet
    const COLUMN_PARTICIPANT_NAME = {
        fontSize: 40,
        color: primaryColor,
        xOffset: 0,
        yOffset: -2,
    };

    const COLUMN_COMPANY_NAME = {
        fontSize: 15.28,
        color: primaryColor,
        xOffset: 0,
        yOffset: 6,
    };

    const COLUMN_PM_CERTIFICATE = {
        fontSize: 24.72,
        color: primaryColor,
        xOffset: 0,
        yOffset: -19,
    };

    const COLUMN_MONTH = {
        fontSize: 14,
        color: primaryColor,
        xOffset: 100,
        yOffset: 5,
    };

    const COLUMN_HOUR = {
        fontSize: 14,
        color: primaryColor,
        xOffset: 73,
        yOffset: 35,
    };
    ////////////////
    const COLUMN_PDU_CATEGORY = {
        fontSize: 8,
        color: blackColor,
        xOffset: 83, // 83
        yOffset: 9.75, // 9.75
    };

    const COLUMN_PROVIDER_NAME = {
        fontSize: 8,
        color: blackColor,
        xOffset: 87,
        yOffset: 49.2,
    };

    // New custom style for URLs
    const COLUMN_URL = {
        fontSize: 8, // Adjust font size as needed
        color: primaryColor,
        xOffset: 51,
        yOffset: 78,
        maxWidth: 250
    };

    const COLUMN_PHONE = {
        fontSize: 8, // Adjust font size as needed
        color: blackColor,
        xOffset: 87,
        yOffset: 106.5,

    };


    const COLUMN_EMAIL = {
        fontSize: 8, // Adjust font size as needed
        color: blackColor,
        xOffset: 86,
        yOffset: 146.5,

    };

    const COLUMN_PDU_EARNED = {
        fontSize: 8, // Adjust font size as needed
        color: blackColor,
        xOffset: 131,
        yOffset: 185.4,

    };

    const COLUMN_PDU_CATEGORIES = {
        fontSize: 8, // Adjust font size as needed
        color: blackColor,
        xOffset: 89, //-220
        yOffset: 225.5, // 225.5
        maxWidth: 200
    };


    const columnStyles = [
        COLUMN_PARTICIPANT_NAME, COLUMN_COMPANY_NAME,
        COLUMN_PM_CERTIFICATE, COLUMN_MONTH, COLUMN_HOUR,
        COLUMN_PDU_CATEGORY, COLUMN_PROVIDER_NAME,
        COLUMN_URL, COLUMN_PHONE, COLUMN_EMAIL, COLUMN_PDU_EARNED,
        COLUMN_PDU_CATEGORIES // Add COLUMN_URL to styles
    ];

    // Loop through each row of the Excel data (skip the header row)
    for (let rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
        const rowData = tableData[rowIndex]; // Get the data for the current row

        // Skip rows where all cells are empty
        if (rowData.every(cell => !cell || cell === '')) {
            continue;
        }

        // Load the existing PDF template for each row
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit); // Register the fontkit library

        // Embed the fonts into the PDF
        const AptosRegular = await pdfDoc.embedFont(fontRegular);
        const AptosItalic = await pdfDoc.embedFont(fontItalic);
        const AptosBold = await pdfDoc.embedFont(fontBold);
        const AptosBoldItalic = await pdfDoc.embedFont(fontBoldItalic);

        const pages = pdfDoc.getPages(); // Get all pages of the PDF
        const firstPage = pages[0]; // We only use the first page for this template
        const { width, height } = firstPage.getSize(); // Get page dimensions
        let startY = height - 150; // Starting Y position for drawing text

        rowData.forEach((cellData, cellIndex) => {
            const text = (cellData !== undefined && cellData !== null) ? String(cellData) : ''; // Convert to string and handle empty cells

            // Get the column style based on the current column index
            let columnStyle;
            let fontToUse;

            if (cellIndex === 2) { // Assuming it's the 3rd column for PM Certificate
                // First, use the original COLUMN_PM_CERTIFICATE style
                columnStyle = COLUMN_PM_CERTIFICATE;
                fontToUse = AptosBoldItalic; // As per COLUMN_PM_CERTIFICATE's font

                // Draw the text using the original style
                const originalTextWidth = fontToUse.widthOfTextAtSize(text, columnStyle.fontSize);
                const originalCenteredX = (width - originalTextWidth) / 2;
                const originalX = originalCenteredX + columnStyle.xOffset;
                const originalY = startY - cellIndex * 50 + columnStyle.yOffset;

                firstPage.drawText(text, {
                    x: originalX,
                    y: originalY,
                    size: columnStyle.fontSize,
                    font: fontToUse,
                    color: columnStyle.color,
                });

                // Now, use a different style to display the same text again
                const modifiedPMStyle = {
                    fontSize: 8,
                    color: blackColor,
                    xOffset: 61,
                    yOffset: -161.45,
                    // xOffset: -248,
                    // yOffset: -161.4,
                    font: "regular",
                };

                // Use the modified font style
                const modifiedFont = AptosRegular;
                const modifiedTextWidth = modifiedFont.widthOfTextAtSize(text, modifiedPMStyle.fontSize);

                const modifiedX = modifiedPMStyle.xOffset;
                const modifiedY = startY - cellIndex * 50 + modifiedPMStyle.yOffset;

                // Draw the text again with the modified style
                firstPage.drawText(text, {
                    x: modifiedX,
                    y: modifiedY,
                    size: modifiedPMStyle.fontSize,
                    font: modifiedFont,
                    color: modifiedPMStyle.color,
                });

            }

            // ... (rest of your code)
            else if (cellIndex === 5) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_PDU_CATEGORY, AptosRegular, customXOffset, customYOffset, width);
            }



            else if (cellIndex === 6) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_PROVIDER_NAME, AptosRegular, customXOffset, customYOffset, width);
            }

            else if (cellIndex === 7) { // Assuming this is the COLUMN_URL
                drawWrappedTextWithUnderline(firstPage, text, COLUMN_URL, AptosRegular, startY - cellIndex * 50, width);
            }

            else if (cellIndex === 8) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_PHONE, AptosRegular, customXOffset, customYOffset, width);
            }


            else if (cellIndex === 9) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_EMAIL, AptosRegular, customXOffset, customYOffset, width);
            }

            else if (cellIndex === 10) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_PDU_EARNED, AptosRegular, customXOffset, customYOffset, width);
            }

            else if (cellIndex === 11) {
                const customXOffset = 0; // Customize this value as needed
                const customYOffset = startY - cellIndex * 50; // Customize this value as needed

                // Draw wrapped text with independent offsets
                drawWrappedText(firstPage, text, COLUMN_PDU_CATEGORIES, AptosRegular, customXOffset, customYOffset, width);
            }


            else {
                // Handle other columns as before
                switch (cellIndex) {
                    case 0: // COLUMN_PARTICIPANT_NAME
                        columnStyle = COLUMN_PARTICIPANT_NAME;
                        fontToUse = AptosBoldItalic;
                        break;
                    case 1: // COLUMN_COMPANY_NAME
                        columnStyle = COLUMN_COMPANY_NAME;
                        fontToUse = AptosBold;
                        break;
                    case 3: // COLUMN_MONTH
                        columnStyle = COLUMN_MONTH;
                        fontToUse = AptosBold;
                        break;
                    case 4: // COLUMN_HOUR
                        columnStyle = COLUMN_HOUR;
                        fontToUse = AptosBold;
                        break;
                    case 5: // COLUMN_PDU_CATEGORY
                        columnStyle = COLUMN_PDU_CATEGORY;
                        fontToUse = AptosRegular;
                        break;
                    case 6: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_PROVIDER_NAME;
                        fontToUse = AptosRegular;
                        break;
                    case 7: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_URL;
                        fontToUse = AptosRegular;
                        break;
                    case 8: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_PHONE;
                        fontToUse = AptosRegular;
                        break;
                    case 9: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_EMAIL;
                        fontToUse = AptosRegular;
                        break;
                    case 10: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_PDU_EARNED;
                        fontToUse = AptosRegular;
                        break;
                    case 11: // COLUMN_PROVIDER_NAME
                        columnStyle = COLUMN_PDU_CATEGORIES;
                        fontToUse = AptosRegular;
                        break;

                    default:
                        columnStyle = { fontSize: 10, color: blackColor, xOffset: 0, yOffset: 0, font: "regular" }; // Fallback style
                        fontToUse = AptosRegular;
                        break;
                }

                // Draw text for other columns
                const columnTextWidth = fontToUse.widthOfTextAtSize(text, columnStyle.fontSize);
                const columnCenteredX = (width - columnTextWidth) / 2;
                const columnX = columnCenteredX + columnStyle.xOffset;
                const columnY = startY - cellIndex * 50 + columnStyle.yOffset;

                firstPage.drawText(text, {
                    x: columnX,
                    y: columnY,
                    size: columnStyle.fontSize,
                    font: fontToUse,
                    color: columnStyle.color,
                });
            }
        });

        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();

        // Trigger the download of the PDF
        // Use a unique name for each PDF, e.g., based on the participant's name or row number
        const rowFileName = `Certificate_${rowData[0] || 'Row'}_${rowIndex}.pdf`;
        var file = new File([pdfBytes], rowFileName, {
            type: "application/pdf;charset=utf-8",
        });
        saveAs(file); // Prompt the user to download the generated PDF
    }


    // Log a success message when all PDFs are created
    console.log("All PDFs created successfully.");
};
