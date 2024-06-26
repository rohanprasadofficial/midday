"use client";

import { createClient } from "@midday/supabase/client";
import {
  getCurrentUserTeamQuery,
  getTeamMembersQuery,
} from "@midday/supabase/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@midday/ui/select";
import { Skeleton } from "@midday/ui/skeleton";
import { useEffect, useState } from "react";
import { AssignedUser } from "./assigned-user";

export function AssignUser({ selectedId, isLoading, onSelect }) {
  const [value, setValue] = useState();
  const supabase = createClient();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setValue(selectedId);
  }, [selectedId]);

  useEffect(() => {
    async function getUsers() {
      const { data: userData } = await getCurrentUserTeamQuery(supabase);
      const { data: membersData } = await getTeamMembersQuery(
        supabase,
        userData?.team_id
      );

      setUsers(membersData);
    }

    getUsers();
  }, [supabase]);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="h-[36px] border rounded-md">
          <Skeleton className="h-[14px] w-[60%] rounded-sm absolute left-3 top-[39px]" />
        </div>
      ) : (
        <Select value={value} onValueChange={onSelect}>
          <SelectTrigger
            id="assign"
            className="line-clamp-1 truncate"
            onKeyDown={(evt) => evt.preventDefault()}
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent className="overflow-y-auto max-h-[200px]">
            {users?.map(({ user }) => (
              <SelectItem key={user?.id} value={user?.id}>
                <AssignedUser user={user} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
