import { ActionIcon, Badge, Flex, Title, NavLink } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IoMdTrash } from "react-icons/io";
import { getColorByRolePrompt } from "../../utils/utilities";

/**
 * @param {{
 * title: string
 * responseRole: string
 * active: boolean
 * onClick: () => void
 * onDelete: () => void
 * }} props
 * @returns {JSX.Element}
 */
export default function MessageHistoryItem({
  title,
  responseRole,
  active,
  onClick,
  onDelete,
}) {
  const { hovered, ref } = useHover();
  return (
    <NavLink
      ref={ref}
      label={<Title order={5}>{title}</Title>}
      rightSection={
        <Flex gap="xs" align="center">
          {hovered ? (
            <ActionIcon
              variant="light"
              radius="md"
              color="red"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <IoMdTrash />
            </ActionIcon>
          ) : null}
          <Badge color={getColorByRolePrompt(responseRole)} autoContrast>
            {responseRole}
          </Badge>
        </Flex>
      }
      h={60}
      active={active}
      onClick={onClick}
    />
  );
}
