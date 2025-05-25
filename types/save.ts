export interface SaveData {
  version: string;        // 存档版本号
  timestamp: string;      // 存档时间戳
  playerName: string;     // 玩家名称
  gameProgress: {        // 游戏进度
    level: number;       // 当前等级
    experience: number;  // 经验值
  };
  inventory: {           // 物品栏
    items: Array<{      // 物品列表
      id: string;       // 物品ID
      name: string;     // 物品名称
      quantity: number; // 数量
    }>;
  };
} 