import React from "react";
import { View } from "react-native";

interface BorderProps {
  children?: React.ReactNode;
  className?: string;
  borderWidth?: "thin" | "medium" | "thick" | "none";
  borderColor?: "gray" | "pink" | "blue" | "green" | "red" | "transparent" | "lightPink" | "white";
  borderStyle?: "solid" | "dashed" | "dotted";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

function Border({
  children,
  className,
  borderWidth = "thin",
  borderColor = "gray",
  borderStyle = "solid",
  borderRadius = "md",
  padding = "none",
  margin = "none",
}: BorderProps) {
  // Border width styles
  const widthStyles = {
    none: "",
    thin: "border-[0.5px]",
    medium: "border-2",
    thick: "border-4",
  };

  // Border color styles
  const colorStyles = {
    transparent: "border-transparent",
    gray: "border-gray-200",
    pink: "border-main-pink",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    lightPink: "border-light-pink",
    white: "border-white",
  };

  // Border style (Note: React Native has limited support for border styles)
  const styleClasses = {
    solid: "",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  // Border radius styles
  const radiusStyles = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // Padding styles
  const paddingStyles = {
    none: "",
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Margin styles
  const marginStyles = {
    none: "",
    xs: "m-1",
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
    xl: "m-8",
  };

  const combinedClassName = [
    widthStyles[borderWidth],
    colorStyles[borderColor],
    styleClasses[borderStyle],
    radiusStyles[borderRadius],
    paddingStyles[padding],
    marginStyles[margin],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <View className={combinedClassName}>{children}</View>;
}

export default Border;
