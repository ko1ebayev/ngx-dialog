export interface DialogConfigBase {
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
}

export type DialogConfig<UserConfig = Record<string, any>> = UserConfig &
  DialogConfigBase;
