/**
 * MY WAR ROOM - Premium personal asset intelligence workspace
 * Data models and operations for user-created War Rooms
 */

export interface UserThesis {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface WatchItem {
  catalyst?: string;
  mainRisk?: string;
  upcomingEvent?: string;
}

export interface PersonalNote {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface MyWarRoom {
  id: string;
  userId: string;
  assetSlug: string;
  assetName: string;
  assetSymbol: string;

  // User's thesis
  thesis: UserThesis;

  // What the user is watching
  watching: WatchItem;

  // Personal notes
  notes: PersonalNote[];

  // Status
  status: "active" | "archived";
  isPremium: boolean;

  // Timestamps
  createdAt: number;
  updatedAt: number;
  lastViewedAt: number;
}

export interface MyWarRoomInput {
  userId: string;
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  thesisContent: string;
  watching?: WatchItem;
}

export interface MyWarRoomUpdate {
  thesisContent?: string;
  watching?: WatchItem;
  status?: "active" | "archived";
}

/**
 * Create a new My War Room
 */
export function createMyWarRoom(input: MyWarRoomInput): MyWarRoom {
  const now = Date.now();

  return {
    id: `warroom-${input.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: input.userId,
    assetSlug: input.assetSlug,
    assetName: input.assetName,
    assetSymbol: input.assetSymbol,
    thesis: {
      id: `thesis-${now}`,
      content: input.thesisContent,
      createdAt: now,
      updatedAt: now,
    },
    watching: input.watching || {
      catalyst: undefined,
      mainRisk: undefined,
      upcomingEvent: undefined,
    },
    notes: [],
    status: "active",
    isPremium: false,
    createdAt: now,
    updatedAt: now,
    lastViewedAt: now,
  };
}

/**
 * Update an existing My War Room
 */
export function updateMyWarRoom(
  warRoom: MyWarRoom,
  updates: MyWarRoomUpdate
): MyWarRoom {
  const now = Date.now();

  return {
    ...warRoom,
    thesis: updates.thesisContent
      ? {
          ...warRoom.thesis,
          content: updates.thesisContent,
          updatedAt: now,
        }
      : warRoom.thesis,
    watching: updates.watching || warRoom.watching,
    status: updates.status || warRoom.status,
    updatedAt: now,
  };
}

/**
 * Add a personal note to a War Room
 */
export function addNote(warRoom: MyWarRoom, content: string): MyWarRoom {
  const now = Date.now();
  const newNote: PersonalNote = {
    id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...warRoom,
    notes: [...warRoom.notes, newNote],
    updatedAt: now,
  };
}

/**
 * Update an existing note
 */
export function updateNote(
  warRoom: MyWarRoom,
  noteId: string,
  content: string
): MyWarRoom {
  const now = Date.now();

  return {
    ...warRoom,
    notes: warRoom.notes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            content,
            updatedAt: now,
          }
        : note
    ),
    updatedAt: now,
  };
}

/**
 * Delete a note
 */
export function deleteNote(warRoom: MyWarRoom, noteId: string): MyWarRoom {
  return {
    ...warRoom,
    notes: warRoom.notes.filter((note) => note.id !== noteId),
    updatedAt: Date.now(),
  };
}
