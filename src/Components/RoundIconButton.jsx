import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

const RoundIconButton = ({
  backgroundColor,
  borderColor,
  children,
  iconColor,
  onPress,
}) => {
  const icon = React.cloneElement(children, {
    color: iconColor,
    width: 18,
    height: 18,
  });

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {backgroundColor, borderColor: borderColor || backgroundColor},
      ]}>
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default RoundIconButton;
