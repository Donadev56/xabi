import numeral from "numeral";
import { formatUnits } from "ethers";
import { getChains, StaticToken } from "@lifi/sdk";

export function vibrate() {
  if (navigator.vibrate) {
    // Vibrate pattern: vibrate 200ms
    navigator.vibrate(200);
  } else {
    console.log("Vibration API not supported on this device");
  }
}

export function formatError(error: any) {
  let errorMessage = "";
  if (typeof error == "object" && JSON.stringify(error)) {
    errorMessage = JSON.stringify(error);
  } else {
    if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = (error as any).toString();
    }
  }
  return errorMessage;
}

export const shortName = (name: string) => {
  if (typeof name == "undefined" || name.length == 0) {
    return "UK".toUpperCase();
  }
  if (name.length > 2) {
    return name.slice(0, 2).toUpperCase();
  } else if (name.length == 1) {
    return name[0].toUpperCase();
  }
};

export function copy(text: string) {
  if (typeof navigator != "undefined") {
    navigator.clipboard.writeText(text);
  }
}
export async function Paste() {
  return await navigator.clipboard.readText();
}

export const ZeroAddress = "0x0000000000000000000000000000000000000000";

export function isNativeToken(token: StaticToken) {
  return token.address.toLowerCase() === ZeroAddress;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const amountUsd = (
  amount: bigint,
  decimals: number,
  priceUsd: string,
) => {
  return (
    Number(NumberFormatterUtils.toEth(BigInt(amount ?? BigInt(0)), decimals)) *
    Number(priceUsd)
  );
};

export function convertTimestampToHumanTime(timestamp: number) {
  const now = new Date();
  const timeDifference = now.getTime() - timestamp * 1000;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} sec`;
  } else if (minutes < 60) {
    return `${minutes} min`;
  } else if (hours < 24) {
    return `${hours} h`;
  } else if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"}`;
  } else if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"}`;
  } else {
    return `${years} year${years === 1 ? "" : "s"}`;
  }
}
export const toHumainDate = (date: string) => {
  const dateObj = new Date(date + "-01");

  const options = { year: "numeric", month: "long" };
  const formattedDate = dateObj
    .toLocaleDateString("en-US", options as any)
    .replace(",", "");

  return formattedDate;
};

export function toDMY(timestamp: number): string {
  const date = new Date(timestamp * 1000); // convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export class NumberFormatterUtils {
  static formatPriceUsd(value: number): string {
    return NumberFormatterUtils.formatSmallAmount(value);
  }
  static formatNumber(value: number): string {
    return NumberFormatterUtils.formatSmallAmount(value);
  }

  static formatSmallAmount(value: number): string {
    if (value > 1) return numeral(value).format("0.00");
    if (value > 0.01) return numeral(value).format("0.[000000]");
    if (value > 0.0001) return numeral(value).format("0.[00000000]");
    return numeral(value).format("0.[000000000000]");
  }

  static isNumeric(str: string) {
    return !Array.isArray(str) && Number(str) - parseFloat(str) + 1 >= 0;
  }
  static toWei(value: string, decimals: number) {
    return BigInt(Number(value) * 10 ** decimals);
  }
  static toEth(value: bigint, decimals: number) {
    return NumberFormatterUtils.formatSmallAmount(
      Number(formatUnits(value, decimals)),
    );
  }

  static calculatePercent(oldValue: number, newValue: number) {
    const percent = ((newValue - oldValue) / oldValue) * 100;
    return percent.toFixed(2);
  }
  static calculatePriceBytoken(
    priceOfTokenOne: number,
    priceOfTokenTwo: number,
  ) {
    return;
  }
}

export async function ChainbyChainId(chainId: number) {
  const chains = await getChains();
  return chains.find((e) => e.id === chainId);
}
