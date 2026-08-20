import React from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';

// Import all SVGs
import PlusIconSvg from "./plus.svg";
import CloseIconSvg from "./close.svg";
import BoxIconSvg from "./box.svg";
import CheckCircleIconSvg from "./check-circle.svg";
import AlertIconSvg from "./alert.svg";
import InfoIconSvg from "./info.svg";
import ErrorIconSvg from "./info-hexa.svg";
import BoltIconSvg from "./bolt.svg";
import ArrowUpIconSvg from "./arrow-up.svg";
import ArrowDownIconSvg from "./arrow-down.svg";
import FolderIconSvg from "./folder.svg";
import VideoIconSvg from "./videos.svg";
import AudioIconSvg from "./audio.svg";
import GridIconSvg from "./grid.svg";
import FileIconSvg from "./file.svg";
import DownloadIconSvg from "./download.svg";
import ArrowRightIconSvg from "./arrow-right.svg";
import GroupIconSvg from "./group.svg";
import BoxIconLineSvg from "./box-line.svg";
import ShootingStarIconSvg from "./shooting-star.svg";
import DollarLineIconSvg from "./dollar-line.svg";
import TrashBinIconSvg from "./trash.svg";
import AngleUpIconSvg from "./angle-up.svg";
import AngleDownIconSvg from "./angle-down.svg";
import PencilIconSvg from "./pencil.svg";
import CheckLineIconSvg from "./check-line.svg";
import CloseLineIconSvg from "./close-line.svg";
import ChevronDownIconSvg from "./chevron-down.svg";
import ChevronUpIconSvg from "./chevron-up.svg";
import PaperPlaneIconSvg from "./paper-plane.svg";
import LockIconSvg from "./lock.svg";
import EnvelopeIconSvg from "./envelope.svg";
import UserIconSvg from "./user-line.svg";
import CalenderIconSvg from "./calender-line.svg";
import EyeIconSvg from "./eye.svg";
import EyeCloseIconSvg from "./eye-close.svg";
import TimeIconSvg from "./time.svg";
import CopyIconSvg from "./copy.svg";
import ChevronLeftIconSvg from "./chevron-left.svg";
import UserCircleIconSvg from "./user-circle.svg";
import TaskIconSvg from "./task-icon.svg";
import ListIconSvg from "./list.svg";
import TableIconSvg from "./table.svg";
import PageIconSvg from "./page.svg";
import PieChartIconSvg from "./pie-chart.svg";
import BoxCubeIconSvg from "./box-cube.svg";
import PlugInIconSvg from "./plug-in.svg";
import DocsIconSvg from "./docs.svg";
import MailIconSvg from "./mail-line.svg";
import HorizontaLDotsSvg from "./horizontal-dots.svg";
import ChatIconSvg from "./chat.svg";
import MoreDotIconSvg from "./more-dot.svg";
import BellIconSvg from "./bell.svg";

// Helper function to create icon components
const createIcon = (src: StaticImageData, alt: string) => {
    return function Icon({
                             className = "",
                             width = 20,
                             height = 20
                         }: {
        className?: string;
        width?: number;
        height?: number;
    }) {
        return (
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
            />
        );
    };
}

// Map of icon names to their SVG imports
const iconMap = {
    PlusIcon: { svg: PlusIconSvg, alt: "plus" },
    CloseIcon: { svg: CloseIconSvg, alt: "close" },
    BoxIcon: { svg: BoxIconSvg, alt: "box" },
    CheckCircleIcon: { svg: CheckCircleIconSvg, alt: "check circle" },
    AlertIcon: { svg: AlertIconSvg, alt: "alert" },
    InfoIcon: { svg: InfoIconSvg, alt: "info" },
    ErrorIcon: { svg: ErrorIconSvg, alt: "error" },
    BoltIcon: { svg: BoltIconSvg, alt: "bolt" },
    ArrowUpIcon: { svg: ArrowUpIconSvg, alt: "arrow up" },
    ArrowDownIcon: { svg: ArrowDownIconSvg, alt: "arrow down" },
    FolderIcon: { svg: FolderIconSvg, alt: "folder" },
    VideoIcon: { svg: VideoIconSvg, alt: "video" },
    AudioIcon: { svg: AudioIconSvg, alt: "audio" },
    GridIcon: { svg: GridIconSvg, alt: "grid" },
    FileIcon: { svg: FileIconSvg, alt: "file" },
    DownloadIcon: { svg: DownloadIconSvg, alt: "download" },
    ArrowRightIcon: { svg: ArrowRightIconSvg, alt: "arrow right" },
    GroupIcon: { svg: GroupIconSvg, alt: "group" },
    BoxIconLine: { svg: BoxIconLineSvg, alt: "box line" },
    ShootingStarIcon: { svg: ShootingStarIconSvg, alt: "shooting star" },
    DollarLineIcon: { svg: DollarLineIconSvg, alt: "dollar" },
    TrashBinIcon: { svg: TrashBinIconSvg, alt: "trash" },
    AngleUpIcon: { svg: AngleUpIconSvg, alt: "angle up" },
    AngleDownIcon: { svg: AngleDownIconSvg, alt: "angle down" },
    PencilIcon: { svg: PencilIconSvg, alt: "pencil" },
    CheckLineIcon: { svg: CheckLineIconSvg, alt: "check line" },
    CloseLineIcon: { svg: CloseLineIconSvg, alt: "close line" },
    ChevronDownIcon: { svg: ChevronDownIconSvg, alt: "chevron down" },
    ChevronUpIcon: { svg: ChevronUpIconSvg, alt: "chevron up" },
    PaperPlaneIcon: { svg: PaperPlaneIconSvg, alt: "paper plane" },
    EnvelopeIcon: { svg: EnvelopeIconSvg, alt: "envelope" },
    LockIcon: { svg: LockIconSvg, alt: "lock" },
    UserIcon: { svg: UserIconSvg, alt: "user" },
    CalenderIcon: { svg: CalenderIconSvg, alt: "calendar" },
    EyeIcon: { svg: EyeIconSvg, alt: "eye" },
    EyeCloseIcon: { svg: EyeCloseIconSvg, alt: "eye close" },
    TimeIcon: { svg: TimeIconSvg, alt: "time" },
    CopyIcon: { svg: CopyIconSvg, alt: "copy" },
    ChevronLeftIcon: { svg: ChevronLeftIconSvg, alt: "chevron left" },
    UserCircleIcon: { svg: UserCircleIconSvg, alt: "user circle" },
    ListIcon: { svg: ListIconSvg, alt: "list" },
    TableIcon: { svg: TableIconSvg, alt: "table" },
    PageIcon: { svg: PageIconSvg, alt: "page" },
    TaskIcon: { svg: TaskIconSvg, alt: "task" },
    PieChartIcon: { svg: PieChartIconSvg, alt: "pie chart" },
    BoxCubeIcon: { svg: BoxCubeIconSvg, alt: "box cube" },
    PlugInIcon: { svg: PlugInIconSvg, alt: "plug in" },
    DocsIcon: { svg: DocsIconSvg, alt: "docs" },
    MailIcon: { svg: MailIconSvg, alt: "mail" },
    HorizontaLDots: { svg: HorizontaLDotsSvg, alt: "horizontal dots" },
    ChatIcon: { svg: ChatIconSvg, alt: "chat" },
    MoreDotIcon: { svg: MoreDotIconSvg, alt: "more dot" },
    BellIcon: { svg: BellIconSvg, alt: "bell" },
};

// Create and export all icons
export const PlusIcon = createIcon(iconMap.PlusIcon.svg, iconMap.PlusIcon.alt);
export const CloseIcon = createIcon(iconMap.CloseIcon.svg, iconMap.CloseIcon.alt);
export const BoxIcon = createIcon(iconMap.BoxIcon.svg, iconMap.BoxIcon.alt);
export const CheckCircleIcon = createIcon(iconMap.CheckCircleIcon.svg, iconMap.CheckCircleIcon.alt);
export const AlertIcon = createIcon(iconMap.AlertIcon.svg, iconMap.AlertIcon.alt);
export const InfoIcon = createIcon(iconMap.InfoIcon.svg, iconMap.InfoIcon.alt);
export const ErrorIcon = createIcon(iconMap.ErrorIcon.svg, iconMap.ErrorIcon.alt);
export const BoltIcon = createIcon(iconMap.BoltIcon.svg, iconMap.BoltIcon.alt);
export const ArrowUpIcon = createIcon(iconMap.ArrowUpIcon.svg, iconMap.ArrowUpIcon.alt);
export const ArrowDownIcon = createIcon(iconMap.ArrowDownIcon.svg, iconMap.ArrowDownIcon.alt);
export const FolderIcon = createIcon(iconMap.FolderIcon.svg, iconMap.FolderIcon.alt);
export const VideoIcon = createIcon(iconMap.VideoIcon.svg, iconMap.VideoIcon.alt);
export const AudioIcon = createIcon(iconMap.AudioIcon.svg, iconMap.AudioIcon.alt);
export const GridIcon = createIcon(iconMap.GridIcon.svg, iconMap.GridIcon.alt);
export const FileIcon = createIcon(iconMap.FileIcon.svg, iconMap.FileIcon.alt);
export const DownloadIcon = createIcon(iconMap.DownloadIcon.svg, iconMap.DownloadIcon.alt);
export const ArrowRightIcon = createIcon(iconMap.ArrowRightIcon.svg, iconMap.ArrowRightIcon.alt);
export const GroupIcon = createIcon(iconMap.GroupIcon.svg, iconMap.GroupIcon.alt);
export const BoxIconLine = createIcon(iconMap.BoxIconLine.svg, iconMap.BoxIconLine.alt);
export const ShootingStarIcon = createIcon(iconMap.ShootingStarIcon.svg, iconMap.ShootingStarIcon.alt);
export const DollarLineIcon = createIcon(iconMap.DollarLineIcon.svg, iconMap.DollarLineIcon.alt);
export const TrashBinIcon = createIcon(iconMap.TrashBinIcon.svg, iconMap.TrashBinIcon.alt);
export const AngleUpIcon = createIcon(iconMap.AngleUpIcon.svg, iconMap.AngleUpIcon.alt);
export const AngleDownIcon = createIcon(iconMap.AngleDownIcon.svg, iconMap.AngleDownIcon.alt);
export const PencilIcon = createIcon(iconMap.PencilIcon.svg, iconMap.PencilIcon.alt);
export const CheckLineIcon = createIcon(iconMap.CheckLineIcon.svg, iconMap.CheckLineIcon.alt);
export const CloseLineIcon = createIcon(iconMap.CloseLineIcon.svg, iconMap.CloseLineIcon.alt);
export const ChevronDownIcon = createIcon(iconMap.ChevronDownIcon.svg, iconMap.ChevronDownIcon.alt);
export const ChevronUpIcon = createIcon(iconMap.ChevronUpIcon.svg, iconMap.ChevronUpIcon.alt);
export const PaperPlaneIcon = createIcon(iconMap.PaperPlaneIcon.svg, iconMap.PaperPlaneIcon.alt);
export const EnvelopeIcon = createIcon(iconMap.EnvelopeIcon.svg, iconMap.EnvelopeIcon.alt);
export const LockIcon = createIcon(iconMap.LockIcon.svg, iconMap.LockIcon.alt);
export const UserIcon = createIcon(iconMap.UserIcon.svg, iconMap.UserIcon.alt);
export const CalenderIcon = createIcon(iconMap.CalenderIcon.svg, iconMap.CalenderIcon.alt);
export const EyeIcon = createIcon(iconMap.EyeIcon.svg, iconMap.EyeIcon.alt);
export const EyeCloseIcon = createIcon(iconMap.EyeCloseIcon.svg, iconMap.EyeCloseIcon.alt);
export const TimeIcon = createIcon(iconMap.TimeIcon.svg, iconMap.TimeIcon.alt);
export const CopyIcon = createIcon(iconMap.CopyIcon.svg, iconMap.CopyIcon.alt);
export const ChevronLeftIcon = createIcon(iconMap.ChevronLeftIcon.svg, iconMap.ChevronLeftIcon.alt);
export const UserCircleIcon = createIcon(iconMap.UserCircleIcon.svg, iconMap.UserCircleIcon.alt);
export const ListIcon = createIcon(iconMap.ListIcon.svg, iconMap.ListIcon.alt);
export const TableIcon = createIcon(iconMap.TableIcon.svg, iconMap.TableIcon.alt);
export const PageIcon = createIcon(iconMap.PageIcon.svg, iconMap.PageIcon.alt);
export const TaskIcon = createIcon(iconMap.TaskIcon.svg, iconMap.TaskIcon.alt);
export const PieChartIcon = createIcon(iconMap.PieChartIcon.svg, iconMap.PieChartIcon.alt);
export const BoxCubeIcon = createIcon(iconMap.BoxCubeIcon.svg, iconMap.BoxCubeIcon.alt);
export const PlugInIcon = createIcon(iconMap.PlugInIcon.svg, iconMap.PlugInIcon.alt);
export const DocsIcon = createIcon(iconMap.DocsIcon.svg, iconMap.DocsIcon.alt);
export const MailIcon = createIcon(iconMap.MailIcon.svg, iconMap.MailIcon.alt);
export const HorizontaLDots = createIcon(iconMap.HorizontaLDots.svg, iconMap.HorizontaLDots.alt);
export const ChatIcon = createIcon(iconMap.ChatIcon.svg, iconMap.ChatIcon.alt);
export const MoreDotIcon = createIcon(iconMap.MoreDotIcon.svg, iconMap.MoreDotIcon.alt);
export const BellIcon = createIcon(iconMap.BellIcon.svg, iconMap.BellIcon.alt);