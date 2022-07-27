export type Instructions = (
  | {
      target: "console";
      type: "error" | "print" | "result";
      text: string;
    }
  | {
      target: "game";
      type: "action";
      args: any[];
    }
)[];
