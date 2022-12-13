import { useContext, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, Select } from "antd";
import { useRouter } from "next/router";
import Back from "../../components/Back";
import Collection from "../../contexts/Collection";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../../utils/constants";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const CreateCollection = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const router = useRouter();
  const { collectionName, type, description } = useContext(Collection);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div className="w-18">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload collection cover</div>
    </div>
  );

  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };

  const successful = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const res = await contract.initCollection(
          "Join3", // Collection name
          "projects", // 给合约加了 _type 但是目前获取不到，不知道有何用
          "symbol" // ERC721 的 symbol，用户可以不填这个，没啥用
        );
        console.log("init_contract status", res);
      }
      router.push("/Collection/Successful");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div className="px-[54px] py-6">
      <div className="flex justify-between items-center">
        <Back />
        <div className="text-[50px] font-bold">Review</div>
        <div></div>
      </div>
      <div className="flex gap-20 ml-[182px]">
        <div>
          <div className="mt-16">
            <div className="text-[30px] font-bold">Collection Name</div>
            <div className="text-[#747474] text-[25px]">{collectionName}</div>
          </div>
          <div className="mt-[38px]">
            <div className="text-[30px] font-bold">Type</div>
            <div className="text-[#747474] text-[25px]">{type}</div>
          </div>
          <div className="mt-[38px]">
            <div className="text-[30px] font-bold">Description</div>
            <div className="text-[#747474] text-[25px]">{description}</div>
          </div>
          <div className="mt-[38px]">
            <div className="text-[30px] font-bold">Traits</div>
            <div className="text-[#747474] text-[25px]">{description}</div>
          </div>
        </div>
      </div>
      <div className="f-c-c mt-4">
        <div className="btn" onClick={() => successful()}>
          Create
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
