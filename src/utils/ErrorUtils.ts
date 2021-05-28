import toast from "react-hot-toast";

export function handleError(error: any): void {
  const response = error.data;

  if (
    response?.responseMessages?.length > 0 &&
    response?.responseMessages[response.responseMessages.length - 1].message
  ) {
    toast(
      response.responseMessages[response.responseMessages.length - 1].message ||
        ""
    );
  } else if (error.message) {
    toast(error.message);
  } else if (typeof error === "string") {
    toast(error);
  }
}
