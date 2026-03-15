import { ClassifiedBranch } from "./types";

export function generateNotificationMessage(branch: ClassifiedBranch): string {
  const ownerGreeting = branch.owner?.name
    ? `안녕하세요, ${branch.owner.name}님!`
    : "안녕하세요!";

  const ageText = branch.ageInDays >= 30
    ? `약 ${Math.floor(branch.ageInDays / 30)}개월 (${branch.ageInDays}일)`
    : `${branch.ageInDays}일`;

  const mergedText = branch.merged ? "병합 완료된 " : "";

  const lines: string[] = [
    ownerGreeting,
    "",
    `GitLab 저장소 정리 작업의 일환으로, ${mergedText}브랜치 \`${branch.name}\`의 처리가 필요합니다.`,
    "",
    `📋 브랜치 정보`,
    `• 이름: ${branch.name}`,
    `• 마지막 커밋: ${branch.ageInDays === 0 ? "오늘" : `${ageText} 전`}`,
    `• 상태: ${branch.merged ? "병합 완료" : "미병합"}`,
    `• 분류 사유: ${branch.classificationReason}`,
    "",
  ];

  if (branch.classification === "delete-recommended") {
    lines.push(`이 브랜치는 삭제 권장 상태입니다. 더 이상 필요하지 않다면 삭제해 주시면 감사하겠습니다.`);
    lines.push(`만약 아직 필요한 브랜치라면, 알려 주시면 보존하겠습니다.`);
  } else {
    lines.push(`이 브랜치의 현재 상태와 계속 유지 여부를 확인 부탁드립니다.`);
  }

  lines.push("");
  lines.push(`브랜치 링크: ${branch.webUrl}`);
  lines.push("");
  lines.push("감사합니다!");

  return lines.join("\n");
}
