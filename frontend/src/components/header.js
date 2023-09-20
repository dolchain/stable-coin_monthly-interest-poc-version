"use client";
import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export default function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex justify-between ">
      <Web3Button />
    </div>
  );
}
