import { useState, FC } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { message, Select, Upload } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'

const Edit = () => {
  const selectOptions = [
    {
      value: 'github',
      label: 'github'
    },
    {
      value: 'twitter',
      label: 'twitter'
    },
    {
      value: 'discord',
      label: 'discord'
    },
    {
      value: 'youtube',
      label: 'youtube'
    }
  ]

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [mediaList, setMediaList] = useState([1])

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const handleChangeSelect = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <div className="px-[160px] py-[72px]">
      <div className="flex justify-between">
        <div className="text-[32px] font-bold">Edit Profile</div>
        <div className="btn w-[100px] h-[40px]">Save</div>
      </div>
      <div className="text-[#666] text-[16px] mt-16">Photo</div>
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
      <div className="mt-6">
        <div className="text-[#666] mb-2">Name</div>
        <input type="text" className="input input-bordered w-full max-w-xs" />
      </div>
      <div className="mt-6">
        <div className="text-[#666] mb-2">Bio</div>
        <input type="text" className="input input-bordered w-full max-w-xs" />
      </div>
      <div className="mt-6">
        <div className="flex gap-9">
          <div className="text-[#666]">Social Media</div>
          <div
            className="text-[#999] text-[14px] f-c-c cursor-pointer"
            onClick={() => setMediaList([...mediaList, 1])}
          >
            + Add Social Media
          </div>
        </div>
        {mediaList.map((item, index) => {
          return (
            <div className="mt-2">
              <Select
                defaultValue="twitter"
                style={{ width: 120 }}
                onChange={handleChangeSelect}
                options={selectOptions}
              />
              <input
                type="text"
                className="input input-bordered w-full max-w-xs h-8 ml-3 mt-1"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Edit
