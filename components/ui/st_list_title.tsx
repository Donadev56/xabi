import ListTitle from "./listitle";

type ListTitleType = React.ComponentProps<typeof ListTitle>;
export const StListTitle = ({ ...props }: ListTitleType) => {
  return (
    <ListTitle
      {...props}
      listTitleStyle={{
        justifyContent: "space-between",
      }}
      leftStyle={{
        maxWidth: "70%",
      }}
      titleStyle={{
        maxWidth: "100%",
        display: "flex",
      }}
      mainTextStyle={{
        maxWidth: "100%",
      }}
      subtitleStyle={{
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
      }}
      actionsStyle={{
        maxWidth: "20%",
        minWidth: "20%",
        width: "20%",
        display: "flex",
        justifyContent: "end",
      }}
    />
  );
};
