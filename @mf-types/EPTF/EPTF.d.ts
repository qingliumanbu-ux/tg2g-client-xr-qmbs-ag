declare module 'EPTF/tffilemanager' {
  import CustomFileSystemProvider from 'devextreme/file_management/custom_provider'
  const _default: import('vue').DefineComponent<
    {
      recId: {
        type: StringConstructor
        default: string
        require: boolean
      }
      addDirectory: {
        type: StringConstructor
        default: string
        require: boolean
      }
      extensionType: {
        type: StringConstructor
        default: string
        require: boolean
      }
      showToolbar: {
        type: BooleanConstructor
        default: boolean
        require: boolean
      }
      download: {
        type: BooleanConstructor
        default: boolean
        require: boolean
      }
      cateInfo: {
        type: StringConstructor
        default: string
        require: boolean
      }
      code: {
        type: StringConstructor
        require: boolean
      }
      imageSize: {
        type: NumberConstructor
        default: number
      }
      isCategorized: {
        type: BooleanConstructor
        default: boolean
        require: boolean
      }
    },
    {
      fileManagerRef: any
      selectKeyArr: any
      allFileList: any
      localFileList: any
      allowExtensionType: any
      onError: (e: any) => boolean
      toolbarClick: (e: any) => void
      refresh: {
        items: {
          text: string
          icon: string
        }[]
        onItemClick: () => void
      }
      onFileUploaded: (e: any) => void
      onFileUploading: (e: any) => void
      fileSystemProvider: CustomFileSystemProvider
      permissions: {
        create: boolean
        copy: boolean
        showNavPane: boolean
        move: boolean
        delete: boolean
        rename: boolean
        upload: boolean
        download: boolean
      }
      uploadMenuOptions: {
        items: {
          text: string
          icon: string
        }[]
        onItemClick: (e: any) => void
      }
      deleteMenuOptions: {
        items: {
          text: string
          icon: string
        }[]
        onItemClick: (e: any) => void
      }
      downloadMenuOptions: {
        items: {
          text: string
          icon: string
        }[]
        onItemClick: (item: any) => void
      }
      previewMenuOptions: {
        items: {
          text: string
          icon: string
        }[]
        onItemClick: (item: any) => void
      }
      popupVisible: import('vue').Ref<boolean>
      popupInfo: import('vue').Ref<{
        message: string
        type: string
      }>
      confirmButtonOptions: {
        text: string
        onClick: () => void
      }
      closeButtonOptions: {
        text: string
        onClick: () => void
      }
      toast: import('vue').Ref<{
        visible: boolean
        message: string
        type: string
      }>
      showFileList: () => void
      previewItems: (item: any) => void
    },
    unknown,
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    ('fileDeleted' | 'fileUpload' | 'fileDownload' | 'filePreview' | 'getFilesPath')[],
    'fileDeleted' | 'fileUpload' | 'fileDownload' | 'filePreview' | 'getFilesPath',
    import('vue').VNodeProps &
      import('vue').AllowedComponentProps &
      import('vue').ComponentCustomProps,
    Readonly<
      import('vue').ExtractPropTypes<{
        recId: {
          type: StringConstructor
          default: string
          require: boolean
        }
        addDirectory: {
          type: StringConstructor
          default: string
          require: boolean
        }
        extensionType: {
          type: StringConstructor
          default: string
          require: boolean
        }
        showToolbar: {
          type: BooleanConstructor
          default: boolean
          require: boolean
        }
        download: {
          type: BooleanConstructor
          default: boolean
          require: boolean
        }
        cateInfo: {
          type: StringConstructor
          default: string
          require: boolean
        }
        code: {
          type: StringConstructor
          require: boolean
        }
        imageSize: {
          type: NumberConstructor
          default: number
        }
        isCategorized: {
          type: BooleanConstructor
          default: boolean
          require: boolean
        }
      }>
    > & {
      onFileDeleted?: ((...args: any[]) => any) | undefined
      onFileUpload?: ((...args: any[]) => any) | undefined
      onFileDownload?: ((...args: any[]) => any) | undefined
      onFilePreview?: ((...args: any[]) => any) | undefined
      onGetFilesPath?: ((...args: any[]) => any) | undefined
    },
    {
      recId: string
      addDirectory: string
      extensionType: string
      showToolbar: boolean
      download: boolean
      cateInfo: string
      imageSize: number
      isCategorized: boolean
    }
  >
  export default _default
}
declare module 'EPTF/eptfManager' {
  export function eptfManager(): {
    fileUploadChunk: (
      files: FileList,
      code: string,
      recId: string,
      renameList?: Map<string, string>,
      isCover?: boolean
    ) => Promise<any>
    fileDownload: (
      fullFileName: string[],
      code: string,
      recId: string,
      isDownload?: boolean
    ) => Promise<any>
    fileRemove: (removeFileName: string, code: string, recId: string) => Promise<any>
    getFiles: (code: string, recId: string) => Promise<any>
    filePreview: (previewFileName: string, code: string, recId: string) => Promise<any>
  }
}
