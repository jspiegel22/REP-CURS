import { Helmet } from "react-helmet-async";
import { ImageManager } from "@/components/images/image-manager";

export function ImageManagementPage() {
  return (
    <>
      <Helmet>
        <title>Image Management | Cabo San Lucas</title>
      </Helmet>
      <ImageManager />
    </>
  );
}