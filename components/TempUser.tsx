import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function DebugUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Aktualny ID użytkownika:", user?.id);
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  return (
    <View>
      <Text>ID użytkownika: {userId || "BRAK"}</Text>
    </View>
  );
}