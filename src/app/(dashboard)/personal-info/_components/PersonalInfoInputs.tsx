"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/hooks/use-toast";
import { UploadButton } from "~/utils/uploadthing";

interface Props {
  givenName: string | undefined | null;
  familyName: string | undefined | null;
  image: string | undefined | null;
}

export default function PersonalInfoInputs({
  givenName: initialGivenName,
  familyName: initialFamilyName,
  image: initialImage,
}: Props) {
  const [givenName, setGivenName] = useState(initialGivenName ?? undefined);
  const [familyName, setFamilyName] = useState(initialFamilyName ?? undefined);
  const [image, setImage] = useState(initialImage ?? undefined);

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={image ?? "/placeholder-avatar.jpg"}
            alt="Profile picture"
          />
          <AvatarFallback>UN</AvatarFallback>
          <Input
            id="image"
            name="image"
            value={image}
            hidden
            className="hidden"
            readOnly
          />
        </Avatar>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const uploadedImage = res[0]?.url;

            if (!uploadedImage) {
              toast({
                title: "Error",
                description: "No image uploaded",
              });
              return;
            }

            setImage(uploadedImage);
            toast({
              title: "Success",
              description: "Upload Completed",
            });
          }}
          onUploadError={(error: Error) => {
            toast({
              title: "Error",
              description: error.message,
            });
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="givenName">Given Name</Label>
        <Input
          id="givenName"
          name="givenName"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
          placeholder="Enter your given name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="familyName">Family Name</Label>
        <Input
          id="familyName"
          name="familyName"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Enter your family name"
        />
      </div>
    </>
  );
}
