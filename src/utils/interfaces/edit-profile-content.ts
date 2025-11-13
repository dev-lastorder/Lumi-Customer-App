interface IEditProfileContentGeneralProps {
  title: string;
  userId: string;
  content?: string;
}
export interface IEditProfileContentHeaderProps extends IEditProfileContentGeneralProps {}

export interface IEditProfileContentMainProps extends IEditProfileContentGeneralProps {}
export interface IDeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
