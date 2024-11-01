import React from "react";
import useDrivePicker from "react-google-drive-picker";

const GoogleDriverPicker = () => {
    const [openPicker] = useDrivePicker();

    const handleOpenPicker = () => {
        openPicker({
            clientId: "966252714987-i9g0mr72tf7c1ae051o221heagbiegc4.apps.googleusercontent.com",
            developerKey: "AIzaSyAhj80NKqZRTeQOwHjKyXT3BSdwYZZ2UL0",
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                    return;
                }
                if (data.action === 'picked') {
                    console.log("Files picked:", data.docs);
                    downloadFiles(data.docs);
                }
            },
        });
    };

    // Function to download selected files using Google Drive API
    const downloadFiles = async (files) => {
        for (const file of files) {
            const fileId = file.id;
            const fileName = file.name;
            try {
                const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer 966252714987-i9g0mr72tf7c1ae051o221heagbiegc4.apps.googleusercontent.com` // Replace with your OAuth token
                    }
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName; // Set the filename
                a.click();
                window.URL.revokeObjectURL(url); // Clean up the URL object
            } catch (error) {
                console.error(`Error downloading file ${fileName}:`, error);
            }
        }
    };

    return (
        <div>
            <button onClick={() => handleOpenPicker()}>Open Picker</button>
        </div>
    );
};

export default GoogleDriverPicker;
