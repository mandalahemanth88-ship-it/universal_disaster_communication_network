import { useState, useEffect } from 'react';

interface PermissionState {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

interface Permissions {
  camera: PermissionState;
  microphone: PermissionState;
  location: PermissionState;
  notifications: PermissionState;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permissions>({
    camera: { granted: false, denied: false, prompt: true },
    microphone: { granted: false, denied: false, prompt: true },
    location: { granted: false, denied: false, prompt: true },
    notifications: { granted: false, denied: false, prompt: true },
  });

  const checkPermission = async (name: PermissionName): Promise<PermissionState> => {
    try {
      const result = await navigator.permissions.query({ name });
      return {
        granted: result.state === 'granted',
        denied: result.state === 'denied',
        prompt: result.state === 'prompt',
      };
    } catch (error) {
      console.warn(`Permission check failed for ${name}:`, error);
      return { granted: false, denied: false, prompt: true };
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false)
      );
    });
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const requestAllPermissions = async () => {
    const [camera, microphone, location, notifications] = await Promise.all([
      requestCameraPermission(),
      requestMicrophonePermission(),
      requestLocationPermission(),
      requestNotificationPermission(),
    ]);

    setPermissions({
      camera: { granted: camera, denied: !camera, prompt: false },
      microphone: { granted: microphone, denied: !microphone, prompt: false },
      location: { granted: location, denied: !location, prompt: false },
      notifications: { granted: notifications, denied: !notifications, prompt: false },
    });

    return { camera, microphone, location, notifications };
  };

  useEffect(() => {
    const checkAllPermissions = async () => {
      const [camera, microphone, location] = await Promise.all([
        checkPermission('camera' as PermissionName),
        checkPermission('microphone' as PermissionName),
        checkPermission('geolocation' as PermissionName),
      ]);

      const notifications = {
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied',
        prompt: Notification.permission === 'default',
      };

      setPermissions({ camera, microphone, location, notifications });
    };

    checkAllPermissions();
  }, []);

  return {
    permissions,
    requestCameraPermission,
    requestMicrophonePermission,
    requestLocationPermission,
    requestNotificationPermission,
    requestAllPermissions,
  };
};
