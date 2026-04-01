import { Button } from "./Button";

export const ToggleButton = ({ active, onChange, children }) => {
  return (
    <Button
      variant={active ? "primary" : "outline"}
      onClick={() => onChange(!active)}>
      {children}
    </Button>
  );
};
