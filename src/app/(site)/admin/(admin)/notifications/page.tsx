"use client";
import React from "react";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";
import Image from "next/image";
import Link from "next/link";


export default function Notifications() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Notifications
        </h3>
        <div className="space-y-6">
          <div className="relative">
            <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
              {/* Example notification items */}
              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-02.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>5 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-03.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 block space-x-1  text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>8 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                    href="#"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-04.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>15 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                    href="#"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-05.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>1 hr ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"

                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-02.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>5 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-03.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>8 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-04.jpg"
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>15 min ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>

              <li>
                <DropdownItem

                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                    href="#"
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <Image
                    width={40}
                    height={40}
                    src="/images/user/user-05.jpg"
                    alt="User"
                    className="overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

                  <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>1 hr ago</span>
                </span>
              </span>
                </DropdownItem>
              </li>
              {/* Add more items as needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
