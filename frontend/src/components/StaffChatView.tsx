import React from 'react';
import { AllChatView } from './AllChatView';

// Staff chat view reuses AllChatView which handles all chat threads
export function StaffChatView() {
  return <AllChatView />;
}
