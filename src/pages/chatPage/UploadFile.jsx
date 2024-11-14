import {
  Button,
  Checkbox,
  FileButton,
  Flex,
  Grid,
  Input,
  Popover,
  ScrollArea,
  Skeleton,
  Title,
  rem,
  Menu,
} from "@mantine/core";
import { FaGoogleDrive } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import {
  IoIosCloudUpload,
  IoIosSearch,
  IoMdClose,
  IoIosLogOut,
  IoMdArrowDropdown,
} from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import {
  fileAcceptance,
  gridBreakpoints,
  gridSpan,
} from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import FileCard from "../../components/FileCard";
import Empty from "../../components/Empty";
import { Dropzone } from "@mantine/dropzone";
import { deleteFile, getFiles, uploadFiles } from "../../apis/files";
import useGlobalStore from "../../context/global";
import { formatLongFileName, formatDateString } from "../../utils/utilities";
import { notifications, showNotification } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import useDrivePicker from "react-google-drive-picker";

/**
 * @param {File[]} selectedFiles
 * @returns {DisplayedFile[]}
 */
const parseFileObject = (selectedFiles) => {
  return selectedFiles.map((file, index) => ({
    id: index,
    fileName: file.name,
    fileType: file.name.split(".").pop(),
    uploadedDate: new Date().toISOString().split("T")[0],
    status: "pending",
  }));
};

/**
 * @param {FileData[]} files
 * @returns {DisplayedFile[]}
 */
const parseFileData = (files) => {
  return files.map((file) => ({
    id: file.id,
    fileName: file.file_name,
    fileType: file.type,
    uploadedDate: formatDateString(file.created_at),
    status: file.status,
  }));
};

/**
 * @returns {React.ReactNode[]}
 */
function GetSkeletonFiles() {
  return [1, 2, 3].map((index) => (
    <Grid.Col key={index} span={gridSpan}>
      <Skeleton height={200} radius="md" />
    </Grid.Col>
  ));
}

export default function UploadFileSection() {
  const navigator = useNavigate();
  // Files State
  const [fileLoading, setFileLoading] = useState(false);
  const files = useGlobalStore((state) => state.files);
  const setFiles = useGlobalStore((state) => state.setFiles);
  const setFilesStatus = useGlobalStore((state) => state.setFilesStatus);
  // Search State
  const [fileSearch, setFileSearch] = useState("");
  const [fileSearchDebounce] = useDebouncedValue(fileSearch, 500);
  const [fileTypeFilter, setFileTypeFilter] = useState([]);
  const [fileStatusFilter, setFileStatusFilter] = useState([]);
  // Scroll State
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const scrollViewport = useRef(null);
  const scrollElement = useRef(null);
  const [filePageIndex, setFilePageIndex] = useState(0);
  const [fileTotalPages, setFileTotalPages] = useState(0);

  // User Infomation and Log In Page State
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
  const [openPicker] = useDrivePicker();
  /** @type {[GoogleUserData, (GoogleUserData | null) => void]}] */
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /** @param {File[]} selectedFiles */
  const handleUploadFiles = (selectedFiles) => {
    if (selectedFiles.length) {
      uploadFiles({
        files: selectedFiles,
        onProgress: (progressData) => setFilesStatus(progressData.status),
        onSuccess: (progressData) => {
          setFilesStatus(progressData.status);
          handleViewFiles();
        },
        onFail: (message) =>
          notifications.show({
            title: "Something went wrong!",
            message: message,
            color: "red",
          }),
      });
    }
  };

  /**
   * @param {number} pageIndex
   * @param {string} search
   * @param {string} type
   * @param {string} status
   * @param {boolean} concatFiles
   */
  const handleViewFiles = (
    pageIndex,
    search,
    type,
    status,
    concatFiles = false
  ) => {
    setFileLoading(true);
    getFiles({
      pageIndex: pageIndex,
      search: search,
      fileType: type,
      status: status,
      onSuccess: (data) => {
        setFileTotalPages(data.total_pages);
        if (concatFiles) {
          setFiles([...files, ...parseFileData(data.data)]);
        } else {
          setFiles(parseFileData(data.data));
        }
        setFileLoading(false);
      },
      onFail: (message) => {
        notifications.show({
          title: "Something went wrong!",
          message: message,
          color: "red",
        });
        setFileLoading(false);
      },
    });
  };

  /** @param {string} id */
  const handleDeleteFile = (id) => {
    deleteFile({
      id,
      onSuccess: (message) => {
        notifications.show({
          title: "Delete",
          message: message,
          color: "green",
        });
        setFiles(files.filter((file) => file.id !== id));
      },
      onFail: (message) =>
        notifications.show({
          title: "Error",
          message: message,
          color: "red",
        }),
    });
  };



  // Authorize Google Drive
  const authorizeDrive = () => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        resolve(accessToken);
        fetchGoogleUserInfo(accessToken);
        setIsLoggedIn(true);
      } else {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: '966252714987-i9g0mr72tf7c1ae051o221heagbiegc4.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              reject("Authorization failed");
            } else {
              localStorage.setItem('accessToken', tokenResponse.access_token);
              setAccessToken(tokenResponse.access_token);
              fetchGoogleUserInfo(tokenResponse.access_token);
              setIsLoggedIn(true);
              resolve(tokenResponse.access_token);
            }
          },
        });
        tokenClient.requestAccessToken();
      }
    });
  };

  // Fetch Google User Info
  const fetchGoogleUserInfo = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUserInfo(null);
    setIsLoggedIn(false);
    console.log("Logout! Login again!");
  };

  // Download file from Google Drive
  const downloadFileFromDrive = async (fileId, token) => {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId: '966252714987-i9g0mr72tf7c1ae051o221heagbiegc4.apps.googleusercontent.com',
      developerKey: 'AIzaSyAhj80NKqZRTeQOwHjKyXT3BSdwYZZ2UL0',
      scope: 'https://www.googleapis.com/auth/drive.file',
      viewId: 'DOCS',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: async (data) => {
        if (data.action === 'picked') {
          const files = data.docs;
          try {
            const token = await authorizeDrive();
            const driveFiles = await Promise.all(
              files.map(async (file) => {
                const fileContent = await downloadFileFromDrive(file.id, token);
                return new File([fileContent], file.name, { type: file.mimeType });
              })
            );
            handleUploadFiles(driveFiles);
          } catch (error) {
            console.error("Failed to download files from Google Drive:", error);
          }
        } else {
          console.log('User canceled Google Drive picker');
        }
      },
    });
  };

  useEffect(() => {
    setFilePageIndex(0);
    handleViewFiles(
      0,
      fileSearchDebounce,
      fileTypeFilter.length && fileTypeFilter.join(","),
      fileStatusFilter.length && fileStatusFilter.join(",")
    );
  }, [fileSearchDebounce, fileTypeFilter, fileStatusFilter]);

  useEffect(() => {
    if (
      Math.ceil(scrollPosition.y + scrollElement.current?.clientHeight) ===
        scrollViewport.current?.scrollHeight &&
      fileTotalPages > filePageIndex
    ) {
      setFilePageIndex(filePageIndex + 1);
      handleViewFiles(
        filePageIndex + 1,
        fileSearchDebounce,
        fileTypeFilter.length && fileTypeFilter.join(","),
        fileStatusFilter.length && fileStatusFilter.join(","),
        true
      );
    }
  }, [scrollPosition]);

  // Inform user if accessToken will be removed on refresh or close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      localStorage.removeItem("accessToken");
      e.preventDefault();
      e.returnValue =
        "You are about to leave the page, and the accessToken will be deleted. You will need to log in again once you return.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      showNotification({
        title: "Attention",
        message:
          "If you refresh or close the page, you will need to log in again because the token will be deleted.",
        color: "green",
        autoClose: 5000,
      });
    }
  }, [isLoggedIn]);

  // Save file to localStorage if file change
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
  }, [files]);

  // Upload state from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles)); 
    }
  }, []);


  return (
    <Flex direction="column" h="100%">
      <Flex p="md" justify="space-between">
        <Menu shadow="md" width={200} position="bottom-start" keepMounted>
          <Menu.Target>
            <Button radius="xl" color="#868e96" leftSection={<IoMdArrowDropdown />} >
              {userInfo ? userInfo.email.split('@')[0].toUpperCase() : 'Upload Menu'}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <FileButton
              leftSection={<IoIosCloudUpload />}
              radius="xl"
              accept="*"
              multiple
              onChange={(selectedFiles) => {
                handleUploadFiles(selectedFiles);
              }}
            >
              {(props) => (
                <Menu.Item
                  {...props}
                  leftSection={
                    <MdComputer style={{ width: "14px", height: "14px" }} />
                  }
                >
                  Upload from computer
                </Menu.Item>
              )}
            </FileButton>

            <FileButton
              leftSection={<FaGoogleDrive style={{ width: 14, height: 14 }} />}
              radius="xl"
              onClick={async () => {
                const filesFromDrive = await handleOpenPicker();
                if (filesFromDrive) {
                  handleUploadFiles(filesFromDrive);
                }
              }}
            >
              {(props) => (
                <Menu.Item
                  {...props}
                  leftSection={
                    <FaGoogleDrive style={{ width: 14, height: 14 }} />
                  }
                >
                  Upload from Google Drive
                </Menu.Item>
              )}
            </FileButton>

            <Menu.Item
              onClick={logout}
              leftSection={
                <IoIosLogOut style={{ width: "14px", height: "14px" }} />
              }
              style={{
                color: isLoggedIn ? "red" : "initial",
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Flex gap={10}>
          <Popover shadow="md" width={200} position="bottom" radius="md">
            <Popover.Target>
              <Button
                color="gray"
                variant={
                  fileTypeFilter.length || fileStatusFilter.length
                    ? "filled"
                    : "outline"
                }
                radius="xl"
                leftSection={<IoFilter />}
              >
                Filter
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Flex direction="column" gap={20}>
                <Title order={6}>File Type</Title>
                <Checkbox.Group
                  value={fileTypeFilter}
                  onChange={setFileTypeFilter}
                >
                  <Flex direction="column" gap={10}>
                    <Checkbox label="PDF" value="pdf" radius="md" />
                    <Checkbox label="DOCX" value="docx" radius="md" />
                    <Checkbox label="TXT" value="txt" radius="md" />
                  </Flex>
                </Checkbox.Group>
                <Title order={6}>Status</Title>
                <Checkbox.Group
                  value={fileStatusFilter}
                  onChange={setFileStatusFilter}
                >
                  <Flex direction="column" gap={10}>
                    <Checkbox label="Pending" value="pending" radius="md" />
                    <Checkbox label="Uploading" value="uploading" radius="md" />
                    <Checkbox
                      label="Processing"
                      value="processing"
                      radius="md"
                    />
                    <Checkbox label="Success" value="success" radius="md" />
                    <Checkbox label="Error" value="error" radius="md" />
                  </Flex>
                </Checkbox.Group>
              </Flex>
            </Popover.Dropdown>
          </Popover>
          <Input
            placeholder="Search"
            radius="xl"
            leftSection={<IoIosSearch />}
            value={fileSearch}
            onChange={(event) => setFileSearch(event.currentTarget.value)}
          />
        </Flex>
      </Flex>
      {
        files.length || fileLoading ? (
          <ScrollArea
            ref={scrollElement}
            viewportRef={scrollViewport}
            px="md"
            h="100%"
            scrollbars="y"
            onScrollPositionChange={onScrollPositionChange}
          >
            <Grid w="100%" breakpoints={gridBreakpoints}>
              {files.length
                ? files.map((file) => (
                  <Grid.Col key={file.id} span={gridSpan}>
                    <FileCard
                      fileName={formatLongFileName(file.fileName, 15)}
                      fileType={file.fileType}
                      uploadedDate={file.uploadedDate}
                      status={file.status}
                      thumbnail=""
                      onDelete={() => handleDeleteFile(file.id)}
                      onOpen={() => navigator(`/file/${file.id}`)}
                    />
                  </Grid.Col>
                ))
                : null}
              {fileLoading ? <GetSkeletonFiles /> : null}
            </Grid>
          </ScrollArea>
        ) : (
          <Flex h="100%" justify="center" align="center">
            <Empty text="No files uploaded" />
          </Flex>
        )
      }
      <Dropzone.FullScreen
        active={true}
        accept={fileAcceptance.split(",")}
        onDrop={(selectedFiles) => {
          handleUploadFiles(selectedFiles);
          setFiles([...parseFileObject(selectedFiles), ...files]);
        }}
      >
        <Dropzone.Accept>
          <Flex direction="column" justify="center" align="center">
            <IoIosCloudUpload size={48} />
            <Title order={5}>Drop files here</Title>
          </Flex>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Flex direction="column" justify="center" align="center">
            <IoMdClose size={48} />
            <Title order={5}>File type not supported</Title>
          </Flex>
        </Dropzone.Reject>
      </Dropzone.FullScreen>
    </Flex >
  );
}
