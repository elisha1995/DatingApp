using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool isCurrentUser);

    Task<Member?>
        GetMemberForUpdate(
            string id); //GetMemberByIdAsync doesn't return the User object so we need to get it separately
}