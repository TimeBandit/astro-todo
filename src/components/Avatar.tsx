import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarComponentProps {
  src: string;
  alt: string;
  fallbackText: string;
}
export const AvatarComponent = ({
  src,
  alt,
  fallbackText,
}: AvatarComponentProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};
