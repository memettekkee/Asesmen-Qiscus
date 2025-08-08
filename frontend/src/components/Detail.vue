<template>
  <div 
    :class="[
      'fixed top-0 right-0 h-full z-30 transform transition-transform duration-300 ease-in-out',
      'bg-white/80 backdrop-blur-md border-l border-teal-100 flex flex-col',
      isMobile ? 'w-full' : 'w-80'
    ]"
    :style="{ transform: `translateX(${show ? '0' : '100%'})` }"
  >
    <!-- Header -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-teal-100">
      <div class="flex items-center">
        <button
          v-if="isMobile"
          @click="$emit('close')"
          class="mr-3 p-2 rounded-full hover:bg-teal-50 text-teal-600"
        >
          <i class="bx bx-chevron-left text-xl"></i>
        </button>
        <h2 v-if="user?.isGroup" class="font-semibold text-gray-800">Group info</h2>
        <h2 v-else class="font-semibold text-gray-800">Contact info</h2>
      </div>
      <button
        @click="$emit('close')"
        class="p-2 rounded-xl hover:bg-teal-50 text-gray-600 transition-colors"
      >
        <i class="bx bx-x text-xl"></i>
      </button>
    </div>
    
    <!-- Profile Section -->
    <div class="flex flex-col items-center pt-8 pb-6 border-b border-teal-100">
      <div class="relative w-32 h-32">
        <img
          :src="user?.isGroup ? user?.image ? user?.image : 'https://avatar.iran.liara.run/public' : otherUserInfo(user).avatar"
          :alt="user?.name"
          class="w-full h-full rounded-3xl object-cover ring-4 ring-teal-100"
        />
        <div 
          v-if="user?.isGroup" 
          class="absolute -bottom-2 -right-2 px-3 py-1 bg-teal-400 rounded-xl"
        >
          <i class="bx bxs-group text-sm text-white font-medium"/>
        </div>
      </div>
      <div v-if="user?.isGroup" class="flex flex-col">
        <h1 class="mt-4 text-xl font-semibold text-center text-gray-800">
          {{ user?.name }}
        </h1>
        <p class="text-center text-sm text-teal-600">{{ user?.participants?.length }} members</p>
      </div>
      <h1 v-else class="mt-4 text-xl font-semibold text-gray-800">
        {{ otherUserInfo(user).name }}
      </h1>
    </div>
    
    <!-- Group Member Section -->
    <div v-if="user?.isGroup && user?.participants" class="flex-1 overflow-y-auto">
      <div class="p-6 border-b border-teal-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center text-gray-800">
            <i class="bx bx-user text-teal-500 text-xl"></i>
            <span class="ml-3 font-medium">All Members</span>
          </div>
        </div>
        <ul class="flex flex-col gap-3">
          <li 
            v-for="participant in user.participants" 
            :key="participant.id" 
            class="bg-white rounded-xl p-3 flex items-center border border-teal-100 relative"
            @click.stop="handleParticipantClick(participant)"
            :class="{'cursor-pointer': isCurrentUserAdmin && participant.userId !== currentUserId}"
          >
            <!-- Avatar section -->
            <div class="flex-shrink-0 mr-3">
              <img 
                v-if="participant.user.avatar" 
                :src="participant.user.avatar" 
                :alt="participant.user.name" 
                class="w-10 h-10 rounded-full object-cover border border-teal-100"
              />
              <div 
                v-else
                class="w-10 h-10 rounded-full border border-teal-100 flex items-center justify-center bg-white"
              >
                <i class="bx bx-user text-teal-500 text-xl"></i>
              </div>
            </div>
            
            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <h3 class="font-medium text-gray-800 truncate">{{ participant.user.name }}</h3>
                <span v-if="participant.role === 0" 
                      class="ml-2 px-2 py-0.5 text-xs bg-teal-500 text-white rounded-full">
                  ADMIN
                </span>
                <span v-if="participant.userId === currentUserId" 
                      class="ml-2 text-xs text-teal-500">
                  (You)
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate">{{ participant.user.email }}</p>
            </div>
            
            <!-- Action Popup -->
            <div 
              v-if="selectedParticipant && selectedParticipant.id === participant.id && isCurrentUserAdmin && participant.userId !== currentUserId"
              class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md border border-gray-200 py-2 px-3 z-10 w-full"
              @click.stop 
            >
              <button 
                v-if="participant.role === 2"
                @click.stop="handlepromoteToAdmin(participant)"
                class="w-full text-left py-1 px-2 text-sm hover:bg-teal-50 text-teal-600 rounded transition-colors flex items-center"
              >
                <i class="bx bx-crown mr-2"></i> Promote to Admin
              </button>
              <button 
                v-else
                @click.stop="handledemoteToMember(participant)"
                class="w-full text-left py-1 px-2 text-sm hover:bg-red-50 text-red-500 rounded transition-colors flex items-center"
              >
                <i class="bx bx-user mr-2"></i> Demote to Member
              </button>
              <div class="w-full h-px bg-gray-200 my-1"></div>
              <button 
                @click.stop="handleKickFromGroup(participant)"
                class="w-full text-left py-1 px-2 text-sm hover:bg-red-50 text-red-600 rounded transition-colors flex items-center"
              >
                <i class="bx bx-x-circle mr-2"></i> Kick from group
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Group Actions Section -->
      <div v-if="user?.isGroup" class="border-t border-teal-100">
        <div class="p-6">
          <h3 class="text-sm font-semibold text-gray-500 uppercase mb-4">Group settings</h3>
          
          <!-- Actions for Admin -->
          <div v-if="isCurrentUserAdmin" class="space-y-2">
            <!-- Add Member -->
            <button 
              @click="showAddMemberForm = true"
              class="w-full flex items-center justify-between py-3 px-4 bg-white rounded-xl hover:bg-teal-50 transition-colors"
            >
              <div class="flex items-center">
                <i class="bx bx-user-plus text-teal-500 text-xl"></i>
                <span class="ml-3 font-medium text-gray-700">Add member</span>
              </div>
              <i class="bx bx-chevron-right text-gray-400"></i>
            </button>
            
            <!-- Update Group -->
            <button 
              @click="showUpdateGroupForm = true"
              class="w-full flex items-center justify-between py-3 px-4 bg-white rounded-xl hover:bg-teal-50 transition-colors"
            >
              <div class="flex items-center">
                <i class="bx bx-edit text-teal-500 text-xl"></i>
                <span class="ml-3 font-medium text-gray-700">Update group</span>
              </div>
              <i class="bx bx-chevron-right text-gray-400"></i>
            </button>
            
            <!-- Delete Group -->
            <button 
              @click="handleDeleteGroup"
              class="w-full flex items-center justify-between py-3 px-4 bg-white rounded-xl hover:bg-red-50 transition-colors"
            >
              <div class="flex items-center">
                <i class="bx bx-trash text-red-500 text-xl"></i>
                <span class="ml-3 font-medium text-red-600">Delete group</span>
              </div>
            </button>
          </div>
          
          <!-- Leave Group (for all members) -->
          <div class="mt-2">
            <button 
              @click="handleLeaveGroup"
              class="w-full flex items-center justify-between py-3 px-4 bg-white rounded-xl hover:bg-red-50 transition-colors"
            >
              <div class="flex items-center">
                <i class="bx bx-exit text-red-500 text-xl"></i>
                <span class="ml-3 font-medium text-red-600">Leave group</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Group popup form -->
    <div 
      v-if="showUpdateGroupForm && user?.isGroup" 
      class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
      @click.self="showUpdateGroupForm = false"
    >
      <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 w-80 max-w-[90%] m-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium text-gray-800">Update Group</h3>
          <button 
            @click="showUpdateGroupForm = false" 
            class="p-1 rounded-lg hover:bg-teal-50 text-gray-500"
          >
            <i class="bx bx-x text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="groupName" class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              id="groupName"
              v-model="updateGroupName"
              type="text"
              placeholder="Enter group name"
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors"
            />
          </div>
          
          <div>
            <label for="groupImage" class="block text-sm font-medium text-gray-700 mb-1">Group Url Image</label>
            <input
              id="groupImage"
              v-model="updateGroupImage"
              placeholder="Enter group url link image"
              type="text"
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors resize-none"
            />
          </div>
          
          <button 
            @click="handleupdateGroup"
            class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:shadow-md transition-all flex items-center justify-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Update Group</span>
            <span v-else class="flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Updating...
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add member popup form -->
    <div 
      v-if="showAddMemberForm && user?.isGroup" 
      class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddMemberForm = false"
    >
      <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 w-80 max-w-[90%] m-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium text-gray-800">Add Member</h3>
          <button 
            @click="showAddMemberForm = false" 
            class="p-1 rounded-lg hover:bg-teal-50 text-gray-500"
          >
            <i class="bx bx-x text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <input
            id="newMemberId"
            v-model="newMemberId"
            type="text"
            placeholder="Enter user ID"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors"
          />
          
          <button 
            @click="handleAddMemberToGroup"
            class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:shadow-md transition-all flex items-center justify-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Add to Group</span>
            <span v-else class="flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </span>
          </button>
          
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import { useNotification } from '../helpers/notification';
import { chatData } from '../helpers/composeApi';
import { otherUserInfo } from '../helpers/service';
import type { Conversation, Participant } from '../utils/interface';

const { 
  isLoading, 
  error, 
  leaveGroup, 
  deleteGroup, 
  kickUser, 
  addMemberToGroup, 
  updateUserGroup, 
  updateUserRole
} = chatData()

const router = useRouter()
const props = defineProps<{
  user?: Conversation;
  index?: number; 
}>();

const show = ref(false)
const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 50)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const emit = defineEmits(['close', 'roleUpdated'])

const currentUserId = localStorage.getItem('userId');

const isCurrentUserAdmin = computed(() => {
  if (!props.user?.isGroup || !props.user.participants) return false;

  const currentUserParticipant = props.user.participants.find(
    p => p.userId === currentUserId
  );

  return currentUserParticipant && currentUserParticipant.role === 0;
});

const selectedParticipant = ref<Participant | null>(null);
const showAddMemberForm = ref(false);
const newMemberId = ref('');
const showUpdateGroupForm = ref(false);
const updateGroupName = ref(props.user?.name || '');
const updateGroupImage = ref(props.user?.image || '');

// Handle participant click
const handleParticipantClick = (participant: Participant) => {
  if (participant.userId === currentUserId) return;

  if (!isCurrentUserAdmin.value) return;

  if (selectedParticipant.value && selectedParticipant.value.id === participant.id) {
    selectedParticipant.value = null;
  } else {
    selectedParticipant.value = participant;
  }
};

// Close menu when clicking outside
const closeMenu = (event: any) => {
  const participantItem = event.target.closest('li');
  if (participantItem && participantItem.classList.contains('cursor-pointer')) {
    return;
  }
  
  const isMenuItemClick = event.target.closest('[class*="popup"]') || event.target.closest('button');
  if (isMenuItemClick) {
    return;
  }
  
  selectedParticipant.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});

// Promote member to admin
const handlepromoteToAdmin = async (participant: Participant) => {
  if (!props.user) return; 

  const confirmed = await useNotification().confirm(
    'Confirm roles',
    'Are you sure you want to promote this member ?',
    'Yes',
    'No'
  )

  if (confirmed) {
    const toAdminResponse = await updateUserRole(props.user.id, participant.userId, 0);
    if (toAdminResponse) {
      
      const index = props.user.participants.findIndex(p => p.id === participant.id);
      if (index !== -1) {
        props.user.participants[index].role = 0;
      }
      
      selectedParticipant.value = null;
      useNotification().success('Member has been promoted!')
      
      emit('roleUpdated');
    }
  } else {
    useNotification().error('Failed to promote member')
  }
};

// Demote admin to member
const handledemoteToMember = async (participant: Participant) => {
  if (!props.user) return; 

  const confirmed = await useNotification().confirm(
    'Confirm roles',
    'Are you sure you want to demote this member ?',
    'Yes',
    'No'
  )

  if (confirmed) {
    const toMemberResponse = await updateUserRole(props.user.id, participant.userId, 2);
    if (toMemberResponse) {
      
      const index = props.user.participants.findIndex(p => p.id === participant.id);
      if (index !== -1) {
        props.user.participants[index].role = 2;
      }
      
      selectedParticipant.value = null;
      useNotification().success('Member has been demoted!')
      
      emit('roleUpdated');
    }
  } else {
    useNotification().error('Failed to demote member')
  }

};

// Kick user from group
const handleKickFromGroup = async (participant: Participant) => {
  if (!props.user) return; 

  const confirmed = await useNotification().confirm(
    'Confirm kick member',
    'Are you sure you want to leave the group ?',
    'Yes',
    'No'
  )
  if (confirmed) {
    const returnKick = await kickUser(props.user.id, participant.userId)
    if (returnKick) {
      const index = props.user.participants.findIndex(p => p.id === participant.id);
      if (index !== -1) {
        props.user.participants.splice(index, 1);
      }
      
      selectedParticipant.value = null;
      useNotification().success('Successfully kick the member !')
      emit('roleUpdated');
    }
  } else {
    useNotification().error('Failed to kick the member')
  }
};

// Add new member to group
const handleAddMemberToGroup = async () => {
  if (!props.user) return; 

  if (newMemberId.value.trim()) {
    const confirmed = await useNotification().confirm(
    'Confirm add member to the group',
    'Are you sure you want to add this member to the group ?',
    'Yes',
    'No'
  )
    if (confirmed) {
      try {
        const returnAddMember = await addMemberToGroup(props.user.id, newMemberId.value)
        if (returnAddMember) {
          
          newMemberId.value = '';
          showAddMemberForm.value = false;
          useNotification().success('Member successfully added !')
          emit('roleUpdated');
        }
      } catch (err) {
        useNotification().error(err instanceof Error ? err.message : String(err));
      }
    } else {
      useNotification().error('Failed to add member to the group !')
    }
  } else {
    useNotification().warning('Fill the ID!')
  }
};

// Update group function
const handleupdateGroup = async () => {
  if (!props.user) return; 

  if (updateGroupName.value.trim()) {
    const formData = {
      name: updateGroupName.value,
      image: updateGroupImage.value
    }
    const confirmed = await useNotification().confirm(
    'Confirm update the group',
    'Are you sure you want to update the group ?',
    'Yes',
    'No'
  )
    if (confirmed) {
      const returnUpdateGroup = await updateUserGroup(props.user.id, formData)
      if (returnUpdateGroup) {
        
        updateGroupName.value = '';
        updateGroupImage.value = '';
        showUpdateGroupForm.value = false;
      
        emit('close');
        useNotification().success('Group info has been updated!');
        setTimeout(() => {
          router.go(0)
        }, 1000) 
      }
    } else {
      useNotification().error('Failed to update the group !')
    }
  } else {
    useNotification().warning('Fill the group info!')
  }
};

// Handle delete group button click
const handleDeleteGroup = async () => {
  if (!props.user) return; 

  const confirmed = await useNotification().confirm(
    'Confirm delete the group',
    'Are you sure you want to delete the group ?',
    'Yes',
    'No'
  )
  if (confirmed) {
    const returnDelete = await deleteGroup(props.user.id)
    if (returnDelete) {
      emit('close');
      useNotification().success('Group has been deleted!')
      setTimeout(() => {
        router.go(0)
      }, 1000) 
    }
  } else {
    useNotification().error('Failed to delete the group !')
  }
};

// Handle leave group button click 
const handleLeaveGroup = async () => {
  if (!props.user) return; 
  const confirmed = await useNotification().confirm(
    'Confirm leave the group',
    'Are you sure you want to leave the group ?',
    'Yes',
    'No'
  )
  if (confirmed) {
    try {
      const returnLeave = await leaveGroup(props.user.id)
      if (returnLeave) {
        emit('close');
        useNotification().success('You are no longer in this group !')
        setTimeout(() => {
          router.go(0)
        }, 1000) 
      }
    } catch (err) {
      useNotification().error(err instanceof Error ? err.message : String(err));
    }
  } else {
    useNotification().error('Failed to leave the group !')
  }
};
</script>